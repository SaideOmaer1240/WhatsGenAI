import vendorSearch from './src/utils/vendorSearch.js';


import { PrismaClient } from "@prisma/client";


// Inicializa o Prisma Client
const prisma = new PrismaClient();
const sellerService = new vendorSearch(prisma);

// Função para teste
async function test() {
  const sessionId = "ana";  
  try {
    // Testando retorno no formato "sellers"
    const data = await sellerService.findSellers({ sessionId, sellerName: null, product: null, returnType: "sellers" });
    console.log("Resultado (sellers):", data);

    const productName = 'Cabelos Naturais Premium';

    const product = data.sellers
      .filter(seller => seller.product === productName)
      .map(seller => seller.product)[0];

    console.log(product);

    // Testando retorno no formato "results"
    const allData = await sellerService.findSellers({ sessionId, sellerName: null, product: null, returnType: "results" });
    console.log("Resultado (results):", allData);
  } catch (error) {
    console.error("Erro ao buscar vendedores:", error.message);
  }
}

// Chama a função de teste
test()


system: [
  {
    role: "system",
    content: `Você é um vendedor inteligente que assume a personalidade do vendedor responsável pelo produto mencionado pelo cliente. 
              Ao identificar um produto ou vendedor no banco de dados, você adapta seu estilo de comunicação para refletir o comportamento e tom do vendedor associado.
              Se o cliente mencionar um produto, você deve responder como o vendedor responsável por ele, utilizando a forma de comunicação e o estilo que esse vendedor normalmente usaria. 
              Caso o cliente mencione o nome de um vendedor, você deve imitar o tom e a abordagem desse vendedor.
              A resposta deve sempre ser amigável, personalizada e persuasiva, com o objetivo de ajudar o cliente e guiá-lo no processo de compra ou no esclarecimento de dúvidas.`,
  },
  {
    role: "user",
    content: `Prompt do cliente: "${prompt}". Banco de dados disponível: ${JSON.stringify(database)}.`,
  },
];

