const db = require('../config/database');

class UserRepository {
    // Busca um usuário pelo email
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0]; // Retorna o usuário ou undefined
    }

    // Cria um novo usuário
    async create(email, passwordHash) {
        const query = `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, created_at
        `;
        const result = await db.query(query, [email, passwordHash]);
        return result.rows[0]; // Retorna o usuário criado (sem a senha)
    }

    // Cria um usuário vindo de rede social
    async createSocialUser(email, provider, providerId) {
        const query = `
            INSERT INTO users (email, auth_provider, provider_id)
            VALUES ($1, $2, $3)
            RETURNING id, email, created_at
        `;
        const result = await db.query(query, [email, provider, providerId]);
        return result.rows[0];
    }

    // Busca um usuário pelo ID
    async findById(id) {
        const query = 'SELECT id, email, created_at FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async createPasswordReset(userId, token, expiresAt) {
        const query = `
            INSERT INTO password_resets (user_id, token, expires_at)
            VALUES ($1, $2, $3)
        `;
        await db.query(query, [userId, token, expiresAt]);
    }

    async findResetToken(token) {
        const query = `
            SELECT * FROM password_resets 
            WHERE token = $1 AND expires_at > NOW()
            ORDER BY created_at DESC LIMIT 1
        `;
        const result = await db.query(query, [token]);
        return result.rows[0];
    }

    async deleteResetTokens(userId) {
        await db.query('DELETE FROM password_resets WHERE user_id = $1', [userId]);
    }

    async updatePassword(userId, hashedPassword) {
        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);
    }
    
}

module.exports = new UserRepository();