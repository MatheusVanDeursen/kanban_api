const db = require('../config/database');

class CardRepository {
    // Cria um novo card no final de uma coluna
    async create(columnId, title, content) {
        // 1. Descobrir a posição máxima atual na coluna
        const maxPosQuery = 'SELECT COALESCE(MAX(position), 0) as max_pos FROM cards WHERE column_id = $1';
        const maxPosResult = await db.query(maxPosQuery, [columnId]);
        const nextPosition = maxPosResult.rows[0].max_pos + 1.0;

        // 2. Inserir o novo card
        const insertQuery = `
            INSERT INTO cards (column_id, title, content, position)
            VALUES ($1, $2, $3, $4)
            RETURNING id, column_id, title, content, position
        `;
        const params = [columnId, title, content, nextPosition];
        const result = await db.query(insertQuery, params);
        
        return result.rows[0];
    }

    // Atualiza a coluna e/ou a posição de um card existente (Drag & Drop)
    async updatePosition(cardId, columnId, newPosition) {
        const updateQuery = `
            UPDATE cards 
            SET column_id = $1, position = $2
            WHERE id = $3
            RETURNING id, column_id, position
        `;
        const params = [columnId, newPosition, cardId];
        const result = await db.query(updateQuery, params);
        
        return result.rows[0];
    }

    // Atualiza o título e/ou conteúdo de um card
    async updateText(cardId, title, content) {
        const query = `
            UPDATE cards 
            SET title = $1, content = $2 
            WHERE id = $3 
            RETURNING id, title, content
        `;
        const result = await db.query(query, [title, content, cardId]);
        return result.rows[0];
    }

    // Remove um card do banco de dados
    async delete(cardId) {
        const query = 'DELETE FROM cards WHERE id = $1 RETURNING id';
        const result = await db.query(query, [cardId]);
        return result.rows[0];
    }
}

module.exports = new CardRepository();