 
const express = require('express');
const router = express.Router(); // Adicionando a definição de router
const authenticateToken = require('../auth/middleware');
const generateToken = require('../auth/genToken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// Verificar autenticação
router.get('/check-auth', authenticateToken, (req, res) => {
    res.status(200).json({ authenticated: true, userId: req.userId });
});

// Cadastro de usuário
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
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

module.exports = router;  