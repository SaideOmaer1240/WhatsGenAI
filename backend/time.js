import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SellerService {
  // Método para pegar o vendedor mais recente de uma sessão
  async getMostRecentSeller(sessionId ) {
    try {
      const seller = await prisma.seller.findFirst({
        where: {
          sessionId: sessionId,
        },
        orderBy: {
          createdAt: 'desc', // Ordena pela data de criação em ordem decrescente
        },
      });
      return seller;
    } catch (error) {
      console.error('Erro ao buscar o vendedor mais recente:', error);
      throw new Error('Não foi possível buscar o vendedor mais recente.');
    }
  }
}

// Exemplo de uso da classe
(async () => {
  const sellerService = new SellerService();
  const sessionId = 'ana';

  try {
    const seller = await sellerService.getMostRecentSeller(sessionId);
    if (seller) {
      console.log('Vendedor mais recente encontrado:', seller);
    } else {
      console.log('Nenhum vendedor encontrado para essa sessão.');
    }
  } catch (error) {
    console.error(error.message);
  }
})();
