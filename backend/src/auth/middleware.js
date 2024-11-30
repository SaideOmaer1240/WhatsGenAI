const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET = 'secret'; // Certifique-se de definir isso no ambiente

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // Verificar se o cabeçalho Authorization existe
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Cabeçalho de autorização ausente ou mal formado.' });
        }

        const token = authHeader.split(' ')[1];

        // Verificar se o token está presente
        if (!token) {
            return res.status(401).json({ error: 'Token ausente.' });
        }

        // Verificar e decodificar o token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Token inválido ou expirado.' });
            }

            // Anexar o ID do usuário à requisição
            req.userId = decoded.userId;
            next();
        });
    } catch (error) {
        console.error('Erro ao autenticar o token:', error);
        res.status(500).json({ error: 'Erro interno ao processar a autenticação.' });
    }
}

module.exports = authenticateToken;
