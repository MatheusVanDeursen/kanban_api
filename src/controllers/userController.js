const userService = require('../services/userService');

class UserController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            }

            const user = await userService.register(email, password);
            return res.status(201).json(user); // 201 = Created
        } catch (error) {
            // Se o erro for de email já em uso (lançado pelo service)
            if (error.message === 'Email já está em uso.') {
                return res.status(409).json({ error: error.message }); // 409 = Conflict
            }
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }

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
    
}

module.exports = new UserController();