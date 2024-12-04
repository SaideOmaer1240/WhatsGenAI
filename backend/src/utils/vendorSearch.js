import logger from "../log/logger.js";



class SellerService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Busca vendedores com base nos parâmetros fornecidos.
   * @param {Object} options - Parâmetros de busca.
   * @param {string} options.sessionId - Identificador da sessão.
   * @param {string} [options.sellerName] - Nome do vendedor (opcional).
   * @param {string} [options.product] - Nome do produto (opcional).
   * @param {string} [options.returnType="sellers"] - Tipo de retorno desejado ("sellers" ou "results").
   * @returns {Object} Resultado da busca.
   */
  async findSellers({ sessionId, sellerName, product, returnType = "sellers" }) {
    try {
      let results = [];

      // Busca por nome do vendedor
      if (sellerName) {
        results = await this.prisma.seller.findMany({
          where: {
            sessionId,
            sellerName: {
              contains: sellerName,
              mode: "insensitive",
            },
          },
        });
      }

      // Busca por produto, caso não tenha resultados por nome
      if (results.length === 0 && product) {
        results = await this.prisma.seller.findMany({
          where: {
            sessionId,
            product: {
              contains: product,
              mode: "insensitive",
            },
          },
        });
      }

      // Caso ainda não haja resultados, busca todos os vendedores da sessão
      if (results.length === 0) {
        results = await this.prisma.seller.findMany({
          where: { sessionId },
        });
      }

      // Decide qual tipo de retorno será enviado
      if (returnType === "sellers") {
        const sellers = results.map(({ sellerName, product }) => ({ sellerName, product }));
        return { sellers };
      }

      // Retorna os resultados completos se o tipo for "results"
      return { results };
    } catch (error) {
      logger.error("Erro ao buscar vendedores no banco de dados:", error);
      throw new Error("Erro interno ao acessar o banco de dados.");
    }
  }
}

export default SellerService;