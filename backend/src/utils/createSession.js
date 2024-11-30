const { Client, LocalAuth, Message } = require('whatsapp-web.js');
const Tools = require('./tools');
const { PrismaClient } = require('@prisma/client');
const { Server } = require('socket.io');

const tools = new Tools();
const prisma = new PrismaClient();

async function createSession(sessionId, userId, sessions, io) {
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: sessionId })
    });

    client.on('qr', async (qr) => {
        console.log(`QR code gerado para sessão ${sessionId}`);
        sessions[sessionId].qr = qr;
        io.emit(`qr-${sessionId}`, qr);
    });

    client.on('ready', async () => {
        console.log(`Cliente ${sessionId} está pronto!`);
        sessions[sessionId].ready = true;

        await prisma.session.upsert({
            where: { sessionId },
            update: { createdAt: new Date() },
            create: { sessionId, userId },
        });
        io.emit(`ready-${sessionId}`); // Emite o evento de prontidão
    });

    client.on('message', async (message) => {
        if (message.fromMe) return;

        const userId = message.from;
        let resposta;

        if (message.hasMedia) {
            const mediaData = await tools.baixarMidia(message);
            resposta = mediaData ? await tools.processarMedia(userId, mediaData, sessionId) : "Não consegui baixar a mídia.";
        } else {
            resposta = await tools.processarTexto(userId, message.body, sessionId);
        }

        try {
            await message.reply(resposta.replace(/\*\*/g, "*"));
        } catch (error) {
            console.error("Erro ao enviar a resposta:", error);
        }
    });

    client.on('disconnected', () => {
        console.log(`Cliente ${sessionId} desconectado.`);
        delete sessions[sessionId];
        io.emit(`disconnected-${sessionId}`);
    });

    client.initialize();

    sessions[sessionId] = { client, qr: null, ready: false };
}

module.exports = createSession;
