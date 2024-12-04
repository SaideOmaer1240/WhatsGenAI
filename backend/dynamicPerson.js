import { ChatGroq } from '@langchain/groq'; 
import dotenv from 'dotenv';
import vendorSearch from './src/utils/vendorSearch.js';
import { PrismaClient } from "@prisma/client";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
  
// Inicializa o Prisma Client
const prisma = new PrismaClient();
const sellerService = new vendorSearch(prisma);

// Configuração do modelo
const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

// Banco de dados de vendedores
const sessionId = "ana";
const database = await sellerService.findSellers({ sessionId, sellerName: null, product: null, returnType: "sellers" });
    console.log("Resultado (sellers):", database);
 

// Função para construir mensagens para a IA
function buildMessages(prompt, database) {
  return [
    {
      role: "system",
      content: "Você é um analisador de texto que verifica se o prompt do usuário contém nomes de vendedores ou produtos presentes no banco de dados. Caso encontre correspondência apenas no produto, deve adicionar no seu JSON o nome do vendedor do banco de dados. Retorne o resultado em JSON no formato: { found: boolean, matched: { sellerName: string | null, product: string | null } }."
    }
    ,
    {
      role: "user",
      content: `Prompt: "${prompt}". Banco de dados: ${JSON.stringify(
        database
      )}.`,
    },
  ];
}

// Função principal para execução
(async function main() {
  try {
    const userPrompt = "ainda tem o produto premium?";

    // Construção das mensagens
    const mensagens = buildMessages(userPrompt, database);
 

    // Vincular o formato de resposta
    const llmComFormatoResposta = llm.bind({
      response_format: { type: "json_object" },
    });
    const mensagemVinculadaIA = await llmComFormatoResposta.invoke(mensagens);

    // Resultado final
    console.log(mensagemVinculadaIA.content,);
  } catch (error) {
    console.error("Erro ao executar o modelo:", error);
  }
})();
