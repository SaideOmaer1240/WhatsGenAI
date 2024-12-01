const express = require('express');
const Joi = require('joi');
const qrcode = require('qrcode');
const { PrismaClient } = require('@prisma/client'); 
const authenticateToken = require('../auth/middleware');
const createSession = require('../utils/createSession');
const prisma = new PrismaClient();
const router = express.Router();

const sessionSchema = Joi.object({
    sessionId: Joi.string().required(),
    userId: Joi.number().integer().required(),
});

module.exports = (io, sessions) => {
    
    // Criar uma nova sessão para um usuário
    router.post('/create', async (req, res) => {
        const { error } = sessionSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { sessionId, userId } = req.body;

        try {
            if (!sessionId || !userId) {
                return res.status(400).json({ error: 'sessionId e userId são obrigatórios.' });
            }

            if (sessions[sessionId]) {
                return res.status(400).json({ error: 'Sessão já existe.' });
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // Criar sessão usando a função utilitária
            createSession(sessionId, userId, sessions, io, ready=false);
            res.status(200).json({ message: 'Sessão criada. Aguarde o QR code.' });
        } catch (err) {
            res.status(500).json({ error: 'Erro ao criar sessão.', details: err.message });
        }
    });

    // Obter todas as sessões de um usuário
    router.get('/user-sessions/:userId', authenticateToken, async (req, res) => {
        const { userId } = req.params;

        try {
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'ID de usuário inválido.' });
            }

            const userSessions = await prisma.session.findMany({
                where: { userId: parseInt(userId, 10) },
            });
            res.status(200).json(userSessions);
        } catch (error) {
            console.error('Erro ao buscar sessões:', error);
            res.status(500).json({ error: 'Erro ao buscar sessões.' });
        }
    });


    // Obter QR Code de uma sessão
    router.get('/get-qr/:sessionId', async (req, res) => {
        const { sessionId } = req.params;

        try {
            if (!sessions[sessionId]) {
                return res.status(404).json({ error: 'Sessão não encontrada.' });
            }

            const { qr, ready } = sessions[sessionId];
            if (ready) {
                return res.status(400).json({ error: 'Sessão já conectada.' });
            }

            if (!qr) {
                return res.status(400).json({ error: 'QR Code ainda não gerado. Tente novamente.' });
            }

            const qrImage = await qrcode.toDataURL(qr);
            res.status(200).json({ qrCode: qrImage });
        } catch (err) {
            res.status(500).json({ error: 'Erro ao gerar QR Code.', details: err.message });
        }
    });

    return router;
};
