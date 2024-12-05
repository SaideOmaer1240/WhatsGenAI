import express from 'express'; // Importando Express
import bcrypt from 'bcrypt'; // Para hashing de senhas
import { PrismaClient } from '@prisma/client'; // Para interagir com o banco de dados

import { authenticateToken } from '../auth/middleware.mjs'; // Importando middleware
import { generateToken } from '../auth/genToken.mjs'; // Gerar token JWT

// Configurando router e Prisma Client
const router = express.Router();
const prisma = new PrismaClient();

// Verificar autenticação
export const checkAuth = router.get('/check-auth', authenticateToken, (req, res) => {
    res.status(200).json({ authenticated: true, userId: req.userId });
});

// Cadastro de usuário
export const registerUser = router.post('/register', async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, phoneNumber },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao cadastrar usuário.', details: error.message });
    }
});

// Login de usuário
export const loginUser = router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = generateToken(user.id);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar login.', details: error.message });
    }
});
