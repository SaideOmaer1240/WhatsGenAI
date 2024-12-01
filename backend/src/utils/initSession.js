const { PrismaClient } = require('@prisma/client');
const createSession = require('./createSession');

const prisma = new PrismaClient();

// Função para inicializar as sessões
async function initSessions(sessions, io) {
    try {
        // Buscando todas as sessões no banco de dados
        const sessionsFromDB = await prisma.session.findMany();
        
        // Iterando sobre as sessões e criando as sessões no sistema
        sessionsFromDB.forEach(session => {
            createSession(session.sessionId, session.userId, sessions, io, ready=true);
        });
    } catch (error) {
        console.error("Erro ao buscar sessões:", error);
    }
}

module.exports = initSessions;
