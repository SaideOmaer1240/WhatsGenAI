import jwt from 'jsonwebtoken';  
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Verifica se a variável JWT_SECRET foi carregada corretamente
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido no ambiente!');
}

// Função para gerar tokens JWT
export function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

 