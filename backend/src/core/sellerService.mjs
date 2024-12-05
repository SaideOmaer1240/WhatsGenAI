import { PrismaClient } from '@prisma/client';

/**
 * Busca o vendedor mais recente associado a um sessionId específico
 * @param {string} sessionId - Identificador da sessão
 * @returns {object|null} - Dados do vendedor mais recente ou null
 */
export async function getMostRecentSellerBySession(sessionId) {
    const prisma = new PrismaClient();
    try {
        let results = [];
        results = await prisma.seller.findFirst({
            where: {
                sessionId: sessionId,  
            },
            orderBy: {
                createdAt: 'desc', // Ordena pela data de criação em ordem decrescente
            },
        });

        if (results.length === 0) {
            console.log(`Nenhum vendedor encontrado para o sessionId: ${sessionId}`);
            return null;
        }

        console.log("Vendedor mais recente encontrado:", results);
        return {results};
    } catch (error) {
        console.error("Erro ao buscar o vendedor mais recente para o sessionId:", error);
        throw error;
    }
}


