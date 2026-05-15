const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

    // Busca os dados do usuário pelo ID
    async getMe(userId) {
        return await userRepository.findById(userId);
    }

    async googleLogin(googleIdToken) {
        // 1. Pede para a biblioteca do Google verificar se o token é autêntico
        const ticket = await googleClient.verifyIdToken({
            idToken: googleIdToken,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        
        // 2. Extrai os dados validados do Google
        const payload = ticket.getPayload();
        const email = payload.email;
        const googleId = payload.sub; // 'sub' é o ID único do usuário no Google

        // 3. Verifica se o usuário já existe no nosso banco
        let user = await userRepository.findByEmail(email);

        if (!user) {
            // Se não existe, cria a conta automaticamente!
            user = await userRepository.createSocialUser(email, 'google', googleId);
        } else if (user.auth_provider === 'local') {
            // Se ele já tinha uma conta com senha, podemos apenas logá-lo,
            // ou você poderia fazer um UPDATE para vincular a conta do Google aqui.
        }

        // 4. Gera o NOSSO token (JWT do Kanban) para ele usar no sistema
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            user: { id: user.id, email: user.email }
        };
    }
    
}

module.exports = new UserService();