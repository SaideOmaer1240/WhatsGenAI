import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Groq } from 'groq-sdk';
import { PrismaClient } from '@prisma/client';
import temp from 'temp'; 

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
temp.track();

const prisma = new PrismaClient();
const visionModel = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    maxOutputTokens: 2048,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const groqModel = process.env.GROQ_MODEL;

class Cerebro {
    constructor() {
        if (!groqModel) {
            throw new Error("Modelo GROQ não configurado. Verifique GROQ_MODEL no arquivo .env.");
        }

        this.llm = groq;
        this.userHistories = {};
        this.groqModel = groqModel;
    }

    atualizarHistorico(userId, entrada, especialidade) {
        if (!this.userHistories[userId]) {
            this.userHistories[userId] = [];
        }

        const systemMessage = this.userHistories[userId].find(msg => msg.role === "system");

        if (especialidade) {
            if (systemMessage) {
                systemMessage.content = especialidade;
            } else {
                this.userHistories[userId].unshift({
                    role: "system",
                    content: especialidade,
                });
            }
        }

        this.userHistories[userId].push(entrada);
        this.limitarHistoricoMensagens(userId);
        return this.userHistories[userId];
    }

    limitarHistoricoMensagens(userId, maxMensagens = 10) {
        if (this.userHistories[userId]?.length > maxMensagens) {
            this.userHistories[userId] = [
                this.userHistories[userId][0], // Preserva a mensagem "system"
                ...this.userHistories[userId].slice(-maxMensagens + 1),
            ];
        }
    }

    async createMessage(sessionId, sender, content, mediaUrl = null) {
        try {
            await prisma.message.create({
                data: { sessionId, sender, content, mediaUrl },
            });
        } catch (error) {
            console.error("Erro ao criar mensagem no banco:", error.message);
        }
    }

    async gerarRespostaIA(userId, mensagemUsuario, sessionId) {
        this.atualizarHistorico(userId, { role: "user", content: mensagemUsuario });

        try {
            const chatCompletion = await this.llm.chat.completions.create({
                messages: this.userHistories[userId],
                model: this.groqModel,
                temperature: 1,
                max_tokens: 1024,
            });

            const respostaIA = chatCompletion.choices[0]?.message?.content || 
                "Não consegui gerar uma resposta.";

            this.atualizarHistorico(userId, { role: "assistant", content: respostaIA });
            await this.createMessage(sessionId, "client", mensagemUsuario);
            await this.createMessage(sessionId, "bot", respostaIA);
         
            return respostaIA;
        } catch (error) {
            console.error("Erro ao gerar resposta da IA:", error.message);
            return "Houve um erro ao tentar gerar a resposta.";
        }
    }

    async transcreverAudio(userId, mediaData, sessionId) {
        let tempFilePath;
        try {
            tempFilePath = temp.path({ suffix: ".mp3" });
            fs.writeFileSync(tempFilePath, mediaData.data.split(",")[1], { encoding: "base64" });

            const transcription = await groq.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: "whisper-large-v3-turbo",
            });

            const transcricao = transcription.text || "Não consegui transcrever o áudio.";
            return await this.gerarRespostaIA(userId, transcricao, sessionId);
        } catch (error) {
            console.error("Erro ao transcrever o áudio:", error.message);
            return "Desculpe, houve um erro ao processar o áudio.";
        } finally {
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }
    }

    async gerarRespostaImagem(userId, mediaData) {
        try {
            const input = [
                {
                    role: "human",
                    content: [
                        { type: "text", text: "Analise a imagem fornecida e descreva-a detalhadamente." },
                        { type: "image_url", image_url: mediaData.data },
                    ],
                },
            ];

            const res = await visionModel.invoke(input);
            const respostaIA = res?.content || "Não consegui analisar a imagem.";

            this.atualizarHistorico(userId, { role: "user", content: "[Imagem recebida do usuário]" });
            this.atualizarHistorico(userId, { role: "assistant", content: respostaIA });

            return respostaIA;
        } catch (error) {
            console.error("Erro ao processar a imagem:", error.message);
            return "Desculpe, houve um erro ao analisar a imagem.";
        }
    }
}

export default Cerebro;
