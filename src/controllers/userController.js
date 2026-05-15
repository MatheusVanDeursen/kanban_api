const userService = require('../services/userService');
const emailService = require('../services/emailService');
const userRepository = require('../repositories/userRepository');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class UserController {
    // Registra um novo usuário no sistema
    async register(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            }

            // Cria o usuário no banco de dados
            const user = await userService.register(email, password);

            // ==========================================
            // DISPARA O E-MAIL DE BOAS VINDAS
            // ==========================================
            emailService.sendWelcomeEmail(user.email);

            return res.status(201).json(user); // 201 = Created
        } catch (error) {
            // Se o erro for de email já em uso (lançado pelo service)
            if (error.message === 'Email já está em uso.') {
                return res.status(409).json({ error: error.message }); // 409 = Conflict
            }
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }

    // Realiza o login do usuário (autenticação local)
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            }

            const data = await userService.login(email, password);
            return res.status(200).json(data); // 200 = OK
        } catch (error) {
            if (error.message === 'Credenciais inválidas.') {
                return res.status(401).json({ error: error.message }); // 401 = Unauthorized
            }
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }

    // Retorna os dados do usuário atualmente autenticado
    async getMe(req, res) {
        try {
            // O id vem do authMiddleware (req.user.id)
            const userId = req.user.id;
            const user = await userService.getMe(userId); // Vamos criar no service também por padrão

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
        }
    }

    // Realiza o login ou cadastro automático via Google
    async googleLogin(req, res) {
        try {
            const { token } = req.body; // Este é o token que o Front-end vai nos enviar

            if (!token) {
                return res.status(400).json({ error: 'Token do Google é obrigatório.' });
            }

            const data = await userService.googleLogin(token);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Erro no login social:', error);
            return res.status(401).json({ error: 'Token do Google inválido ou expirado.' });
        }
    }

    // Solicita a recuperação de senha e envia o e-mail com o link
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await userRepository.findByEmail(email);

            if (!user) {
                // Por segurança, não confirmamos se o e-mail existe ou não
                return res.status(200).json({ message: 'Se o e-mail existir, um link foi enviado.' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 3600000); // 1 hora a partir de agora

            await userRepository.deleteResetTokens(user.id); // Limpa solicitações antigas
            await userRepository.createPasswordReset(user.id, token, expiresAt);
            
            await emailService.sendResetEmail(email, token);

            return res.status(200).json({ message: 'Instruções enviadas para o e-mail.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao processar solicitação.' });
        }
    }

    // Valida o token e atualiza a senha do usuário
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const resetRequest = await userRepository.findResetToken(token);

            if (!resetRequest) {
                return res.status(400).json({ error: 'Token inválido ou expirado.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userRepository.updatePassword(resetRequest.user_id, hashedPassword);
            await userRepository.deleteResetTokens(resetRequest.user_id);

            return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao redefinir senha.' });
        }
    }

}

module.exports = new UserController();