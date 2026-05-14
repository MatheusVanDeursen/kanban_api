const db = require('../config/database');

class ColumnRepository {
    // Lista todas as colunas de um usuário, já ordenadas pela posição
    async findAllByUserId(userId) {
        const query = `
            SELECT id, title, color, position 
            FROM columns 
            WHERE user_id = $1 
            ORDER BY position ASC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    // Cria uma nova coluna para o usuário
    async create(userId, title, color) {
        // 1. Descobrir a posição máxima atual (para a nova coluna ir pro final)
        const maxPosQuery = 'SELECT COALESCE(MAX(position), 0) as max_pos FROM columns WHERE user_id = $1';
        const maxPosResult = await db.query(maxPosQuery, [userId]);
        const nextPosition = maxPosResult.rows[0].max_pos + 1.0;

        // 2. Inserir a nova coluna
        const insertQuery = `
            INSERT INTO columns (user_id, title, color, position)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, color, position
        `;
        const params = [userId, title, color, nextPosition];
        const result = await db.query(insertQuery, params);
        
        return result.rows[0];
    }

    // Retorna o quadro completo (Colunas + Cards embutidos)
    async getFullBoard(userId) {
        // 1. Busca todas as colunas do usuário ordenadas
        const colQuery = 'SELECT id, title, color, position FROM columns WHERE user_id = $1 ORDER BY position ASC';
        const colResult = await db.query(colQuery, [userId]);
        const columns = colResult.rows;

        if (columns.length === 0) {
            return []; // Se não tem colunas, retorna um array vazio
        }

        // 2. Extrai apenas os IDs das colunas para buscar os cards de uma vez só
        const columnIds = columns.map(col => col.id);

        // 3. Busca TODOS os cards que pertencem a essas colunas (usando ANY)
        const cardQuery = 'SELECT id, column_id, title, content, position FROM cards WHERE column_id = ANY($1::uuid[]) ORDER BY position ASC';
        const cardResult = await db.query(cardQuery, [columnIds]);
        const allCards = cardResult.rows;

        // 4. Monta o quebra-cabeça: coloca cada card dentro da sua respectiva coluna
        const fullBoard = columns.map(column => {
            return {
                ...column,
                cards: allCards.filter(card => card.column_id === column.id) // Anexa os cards aqui
            };
        });

        return fullBoard;
    }

    async update(columnId, userId, title, color) {
        const query = `
            UPDATE columns 
            SET title = $1, color = $2 
            WHERE id = $3 AND user_id = $4 
            RETURNING id, title, color
        `;
        const result = await db.query(query, [title, color, columnId, userId]);
        return result.rows[0];
    }

    async delete(columnId, userId) {
        const query = 'DELETE FROM columns WHERE id = $1 AND user_id = $2 RETURNING id';
        const result = await db.query(query, [columnId, userId]);
        return result.rows[0];
    }
}

module.exports = new ColumnRepository();