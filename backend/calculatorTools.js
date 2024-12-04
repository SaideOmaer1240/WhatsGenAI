const { ChatGroq } = require("@langchain/groq");
const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
require("dotenv").config();

// Instancia o modelo Groq
const llm = new ChatGroq({
  model: "llama3-groq-70b-8192-tool-use-preview",
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY,
});

// Define o esquema da ferramenta usando Zod
const calculatorSchema = z.object({
  operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("Operação a ser executada."),
  number1: z.number().describe("Primeiro número."),
  number2: z.number().describe("Segundo número."),
});

// Implementa a ferramenta calculadora
const calculatorTool = tool(
  async ({ operation, number1, number2 }) => {
    switch (operation) {
      case "add":
        return `${number1 + number2}`;
      case "subtract":
        return `${number1 - number2}`;
      case "multiply":
        return `${number1 * number2}`;
      case "divide":
        return `${number1 / number2}`;
      default:
        throw new Error("Operação inválida.");
    }
  },
  {
    name: "calculator",
    description: "Realiza operações matemáticas simples.",
    schema: calculatorSchema,
  }
);

// Vincula a ferramenta ao modelo
const llmWithTools = llm.bindTools([calculatorTool]);
console.log("Ferramentas disponíveis:", llmWithTools.tools);

// Invoca o modelo com uma pergunta
(async () => {
    try {
      const res = await llmWithTools.invoke("Qual é o resultado de 15 dividido por 30?");
  
      if (res.additional_kwargs && res.additional_kwargs.tool_calls) {
        const toolCalls = res.additional_kwargs.tool_calls;
        console.log("Tool Calls:", toolCalls);
  
        // Itera sobre as chamadas de ferramenta
        for (const call of toolCalls) {
          const { id, function: toolFunction } = call;
  
          if (toolFunction && toolFunction.name === "calculator") {
            // Faz o parse dos argumentos JSON
            const args = JSON.parse(toolFunction.arguments);
  
            const { number1, number2, operation } = args;
            console.log(
              `ID da chamada: ${id}\nOperação: ${operation}\nNúmero 1: ${number1}\nNúmero 2: ${number2}`
            );
  
            // Calcula manualmente ou exibe os argumentos
            let result;
            switch (operation) {
              case "add":
                result = number1 + number2;
                break;
              case "subtract":
                result = number1 - number2;
                break;
              case "multiply":
                result = number1 * number2;
                break;
              case "divide":
                result = number1 / number2;
                break;
              default:
                result = "Operação desconhecida.";
            }
  
            console.log(`Resultado: ${result}`);
          } else {
            console.log("Função não reconhecida ou argumentos ausentes.");
          }
        }
      } else {
        console.log("Resposta direta:", res.content || "Nenhuma resposta encontrada.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  })();
  