import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Certifique-se de que o JWT_SECRET está definido no ambiente, sem atribuir valor padrão no código
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido no ambiente!');
}

export function authenticateToken(req, res, next) {
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
}
