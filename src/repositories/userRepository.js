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
}

module.exports = new UserRepository();