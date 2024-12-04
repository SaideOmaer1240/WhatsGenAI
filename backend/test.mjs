import { ChatGroq } from '@langchain/groq'; 
import dotenv from 'dotenv';
import vendorSearch from './src/utils/vendorSearch.js';
import { PrismaClient } from "@prisma/client";
import buildMessages from './src/utils/buildMessage.js';

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

const database = await sellerService.findSellers({ sessionId, sellerName: null, product: null, returnType: "results" }); 
console.log(database);
 
async function sellerJSON(userPrompt, database) {
  const system =
    "Você é um analisador de texto que verifica se o prompt do usuário contém nomes de vendedores ou produtos presentes no banco de dados. Caso encontre correspondência apenas no produto, deve adicionar no seu JSON o nome do vendedor do banco de dados. Retorne o resultado em JSON no formato: { found: boolean, matched: { sellerName: string | null, product: string | null } }.";

  try {
    // Construção das mensagens
    const mensagens = await buildMessages(system, userPrompt, database);

    // Vincular o formato de resposta
    const llmComFormatoResposta = llm.bind({
      response_format: { type: "json_object" },
    });

    // Chamada ao modelo
    const mensagemVinculadaIA = await llmComFormatoResposta.invoke(mensagens);

    // Analise o conteúdo como JSON
    const data = JSON.parse(mensagemVinculadaIA.content);

    return data;
  } catch (error) {
    console.error("Erro ao executar o modelo:", error);
    return null; // Retorne null em caso de erro
  }
}

const userPrompt = "ainda tem o produto premium?";
const data = await sellerJSON(userPrompt, database);

if (data && data.matched) {
  const sellerName = data.matched.sellerName;
  const sellerProduct = data.matched.product;

  console.log(sellerName); // Output: Ana
  console.log(sellerProduct); // Output: Ana
} else {
  console.error("Erro: dados inválidos ou não encontrados.");
}



 
