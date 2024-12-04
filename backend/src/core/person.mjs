import sellerJSON from "./getSeller.mjs";
import SellerService from "../utils/vendorSearch.js";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';  
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
  
// Inicializa o Prisma Client
const prisma = new PrismaClient();
const sellerService = new SellerService(prisma);

 

// Função 1: Gerar Features e Público-Alvo
async function personAI(vendorId, mensagem) {

  const database = await sellerService.findSellers({ sessionId: vendorId, sellerName: null, product: null, returnType: "sellers" }); 
 
  const data = await sellerJSON( mensagem, database);
  
  const vendorName = data?.matched?.sellerName || null;
  const sellerProduct = data?.matched?.product || null;
  
  const alldata = await sellerService.findSellers({ sessionId: vendorId, sellerName: vendorName, product: sellerProduct, returnType: "results" });

   // Acessando e formatando os dados
   const [firstResult] = alldata.results;
   const { 
     id, 
     sessionId, 
     sellerName, 
     product, 
     description, 
     image, 
     benefits, 
     createdAt 
   } = firstResult;
   
   const db = `Banco de dados: \nID: ${id};
   Session ID: ${sessionId};
   Seller Name: ${sellerName};
   Product: ${product};
   Description: ${description};
   Image: ${image || "Nenhuma imagem disponível"};
   Benefits: ${benefits};
   Created At: ${createdAt};
   `;
    try {
        const llm = new ChatGroq({
          model: "llama3-groq-70b-8192-tool-use-preview",
          temperature: 0.7,
          maxRetries: 2,
          apiKey: process.env.GROQ_API_KEY,
        });
    
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                "Você é um vendedor inteligente que assume a personalidade do vendedor responsável pelo produto mencionado pelo cliente. Ao identificar um produto ou vendedor no banco de dados, você adapta seu estilo de comunicação para refletir o comportamento e tom do vendedor associado. Responda de maneira amigável, personalizada e persuasiva, ajudando o cliente a tomar a melhor decisão.",
              ],
              ["human", "Prompt do cliente:  {prompt}. Banco de dados disponível: {database}."]
              ,
        ]);
    
        const chain = prompt.pipe(llm);
    
        const response = await chain.invoke({ 
            prompt: mensagem,
            database: db,
        });
        return response.content; // Retorna o texto com features e público-alvo
      } catch (error) {
        console.error("Erro ao gera reposta:", error);
        throw error;
      }
    }


export default personAI;