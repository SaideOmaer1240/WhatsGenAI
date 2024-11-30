require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Importando as rotas
const authRoutes = require('./src/routes/authRoutes');
const sellerRoutes = require('./src/routes/sellers');
const sessionRoutes = require('./src/routes/sessionsRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE'],
    },
});
const PORT = process.env.PORT || 3000;

// Configuração de CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

// Middleware para parsing de JSON
app.use(express.json());

// Registrar rotas
app.use('/api/auth', authRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/sessions', sessionRoutes(io));

// Middleware global para erros
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
});

// Iniciar servidor HTTP e WebSocket
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Configuração de WebSocket
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});
