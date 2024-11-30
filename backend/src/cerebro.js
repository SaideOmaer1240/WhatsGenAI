const fs = require('fs');
require('dotenv').config();
const path = require("path");
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { Groq } = require('groq-sdk');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const visionModel = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    maxOutputTokens: 2048,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const groqModel = process.env.GROQ_MODEL;
class Cerebro {
    constructor() {
        this.llm = groq; // Supondo que groq seja um módulo já importado
        this.userHistories = {};
        this.groqModel = groqModel;
    }

    // Função para atualizar o histórico e gerenciar mensagens do tipo "system"
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
    
        // Opcional: Retorna o histórico atualizado
        return this.userHistories[userId];
    }
    

    // Função para limitar o histórico de mensagens a um número máximo
    limitarHistoricoMensagens(userId, maxMensagens = 10) {
        if (this.userHistories[userId] && this.userHistories[userId].length > maxMensagens) {
            // Mantém a mensagem "system" e remove as mensagens mais antigas, exceto a "system"
            this.userHistories[userId] = [
                this.userHistories[userId][0],
                ...this.userHistories[userId].slice(-maxMensagens + 1),
            ];
        }
    }

    // Função para criar mensagens no banco de dados
    async createMessage(sessionId, sender, content, mediaUrl = null) {
        try {
            await prisma.message.create({
                data: {
                    sessionId: sessionId,
                    sender: sender,
                    content: content,
                    mediaUrl: mediaUrl,
                },
            });
        } catch (error) {
            console.error("Erro ao criar mensagem:", error);
        }
    }

    // Gera resposta para texto após avaliar o contexto
    async gerarRespostaIA(userId, mensagemUsuario, sessionId) {
        // Atualiza o histórico com a entrada do usuário
        this.atualizarHistorico(userId, { role: "user", content: mensagemUsuario });

        // Avalia o contexto antes de responder
        const loboFrontal = new LoboFrontal(); // Supondo que seja um módulo já importado
        const isGroupMessage = userId.endsWith("@g.us");
        const deveResponder = await loboFrontal.avaliarContexto(
            this.llm,
            userId,
            mensagemUsuario,
            this.userHistories[userId]
        );

        if (isGroupMessage && !deveResponder) {
            return;
        }

        try {
            const chatCompletion = await this.llm.chat.completions.create({
                messages: this.userHistories[userId],
                model: this.groqModel,
                temperature: 1,
                max_tokens: 1024,
            });

            const respostaIA =
                chatCompletion.choices[0]?.message?.content || "Não consegui gerar uma resposta.";

            // Atualiza o histórico com a resposta gerada pela IA
            this.atualizarHistorico(userId, { role: "assistant", content: respostaIA });
            await this.createMessage(sessionId, "client", mensagemUsuario);
            await this.createMessage(sessionId, "bot", respostaIA);

            return respostaIA;
        } catch (error) {
            console.error("Erro ao gerar resposta da IA:", error);
            return "Houve um erro ao tentar gerar a resposta.";
        }
    }

    // Transcreve áudio e gera resposta com base na transcrição
    async transcreverAudio(userId, mediaData, sessionId) {
        try {
            const tempFilePath = path.join(__dirname, `audio_${Date.now()}.mp3`);
            fs.writeFileSync(tempFilePath, mediaData.data.split(",")[1], { encoding: "base64" });

            const transcription = await groq.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: "whisper-large-v3-turbo",
            });

            fs.unlinkSync(tempFilePath);

            const transcricao = transcription.text || "Não consegui transcrever o áudio.";

            return await this.gerarRespostaIA(userId, transcricao, sessionId);
        } catch (error) {
            console.error("Erro ao transcrever o áudio:", error);
            return "Desculpe, houve um erro ao processar o áudio.";
        }
    }

    // Gera resposta para imagem analisando-a detalhadamente
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

            const res = await visionModel.invoke(input); // Supondo que visionModel seja um módulo já importado
            const respostaIA =
                res && res.content ? res.content : "Não consegui analisar a imagem.";

            this.atualizarHistorico(userId, { role: "user", content: "[Imagem recebida do usuário]" });
            this.atualizarHistorico(userId, { role: "assistant", content: respostaIA });

            return respostaIA;
        } catch (error) {
            console.error("Erro ao processar a imagem:", error);
            return "Desculpe, houve um erro ao analisar a imagem.";
        }
    }
}

module.exports = Cerebro;
 


class LoboFrontal {
    async avaliarContexto(llm, userId, mensagemUsuario, conversaAtual) {
        const prompt = `
            Você é um assistente de análise de conversas em grupo, e seu objetivo é avaliar o contexto de uma conversa entre várias pessoas para decidir se deve ou não responder à última mensagem.
            
            Abaixo está o histórico recente da conversa:
            ${JSON.stringify(conversaAtual)}
            Ultima mensagem:${JSON.stringify(mensagemUsuario)}

            Instruções:
            1. Leia atentamente as interações entre os participantes e leve em conta o tom, o conteúdo e a sequência dos diálogos entre eles.
            2. Avalie a última mensagem e considere:
                - Se a última mensagem foi uma pergunta direcionada especificamente ao assistente.
                - Se algum dos participantes solicita explicitamente sua opinião ou assistência.
                - Se a última mensagem tem um contexto claro de interação entre os participantes, sem necessitar intervenção externa.
            3. Em conversas com três ou mais pessoas, analise se a resposta pode ser adequada, mesmo se os outros participantes já estão conversando entre si.
            4. Se não houver sinal claro de necessidade de intervenção ou se o contexto sugere que os usuários estão resolvendo o tópico entre si, então **não responda**.
            5. Caso decida que a resposta é necessária, gere uma resposta clara e relevante que esteja de acordo com o tom e contexto da conversa, mantendo um estilo amigável e colaborativo.
            6. Caso contenha a palavra "inora" na mensagem, responda apenas com "SIM", mas caso não contenha a palavra "inora" não si limite a isso, analize a mensagem segundo as instruções anteriores.

            Com base na análise acima, responda apenas com "SIM" se o assistente deve responder à última mensagem ou "NÃO" caso contrário.
        `;

        const chatCompletion = await llm.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: this.groqModel,
            temperature: 1,
            max_tokens: 1024,
        });

        const decisao = chatCompletion.choices[0]?.message?.content || "NÃO";
        return decisao.trim() === "SIM";
    }
}

module.exports = Cerebro;
