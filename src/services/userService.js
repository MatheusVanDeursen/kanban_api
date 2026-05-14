const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
require('dotenv').config();

class UserService {
    async register(email, password) {
        // 1. Verifica se o usuário já existe
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email já está em uso.');
        }

        // 2. Criptografa a senha
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Salva no banco
        const newUser = await userRepository.create(email, passwordHash);
        return newUser;
    }

    async login(email, password) {
        // 1. Busca o usuário
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas.');
        }

        // 2. Verifica se a senha bate com o hash do banco
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas.');
        }

        // 3. Gera o Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload (dados dentro do token)
            process.env.JWT_SECRET,             // Sua chave secreta do .env
            { expiresIn: '7d' }                 // Tempo de expiração
        );

        // Retorna o token e os dados do usuário (escondendo a senha)
        return {
            token,
            user: { id: user.id, email: user.email }
        };
    }

    async getMe(userId) {
        return await userRepository.findById(userId);
    }
    
}

module.exports = new UserService();