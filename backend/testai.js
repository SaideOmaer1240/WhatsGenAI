import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();


// Função 1: Gerar Features e Público-Alvo
async function generateFeaturesAndAudience(productName) {
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
        "Você é um especialista em marketing. Gere uma lista de três características principais e um público-alvo para o produto: {product_name}.",
      ],
      ["human", "Produto: {product_name}."],
    ]);

    const chain = prompt.pipe(llm);

    const response = await chain.invoke({ product_name: productName });
    return response.content; // Retorna o texto com features e público-alvo
  } catch (error) {
    console.error("Erro ao gerar features e público-alvo:", error);
    throw error;
  }
}

// Função 2: Gerar Descrição do Produto
async function generateProductDescription(productName, features, targetAudience) {
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
        "Você é um especialista em marketing que cria descrições persuasivas de produtos. A descrição deve ser adaptada para {target_audience} e destacar as seguintes características: {features}.",
      ],
      ["human", "Gere uma descrição para o produto: {product_name}."],
    ]);

    const chain = prompt.pipe(llm);

    const response = await chain.invoke({
      product_name: productName,
      features: features.join(", "),
      target_audience: targetAudience,
    });

    return response.content;
  } catch (error) {
    console.error("Erro ao gerar descrição do produto:", error);
    throw error;
  }
}

// Função 3: Fluxo Completo
async function generateCompleteProductDescription(productName) {
  try {
    const featuresAndAudienceText = await generateFeaturesAndAudience(productName);

    // Extração das informações: Assumindo que o modelo retorna algo como "Features: ..., Público-alvo: ..."
    const [featuresText, audienceText] = featuresAndAudienceText.split("Público-alvo:");
    const features = featuresText.replace("Características:", "").trim().split(",");
    const targetAudience = audienceText.trim();

    // Geração da descrição com base nas informações extraídas
    const description = await generateProductDescription(productName, features, targetAudience);

    return description;
  } catch (error) {
    console.error("Erro no fluxo completo:", error);
    throw error;
  }
}

// Exemplo de uso
generateCompleteProductDescription("curso de programação - python para iniciante")
  .then((result) => console.log("Descrição do Produto:", result))
  .catch((err) => console.error("Erro na execução:", err));

