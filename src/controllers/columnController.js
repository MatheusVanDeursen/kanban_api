const columnRepository = require('../repositories/columnRepository');

class ColumnController {
    // GET /api/columns
    async list(req, res) {
        try {
            // Pega o ID injetado pelo authMiddleware
            const userId = req.user.id; 
            const columns = await columnRepository.findAllByUserId(userId);
            
            return res.status(200).json(columns);
        } catch (error) {
            console.error('Erro ao listar colunas:', error);
            return res.status(500).json({ error: 'Erro interno ao buscar colunas.' });
        }
    }

    // POST /api/columns
    async create(req, res) {
        try {
            const userId = req.user.id;
            const { title, color } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'O título da coluna é obrigatório.' });
            }

            // Se o usuário não mandar cor, usamos um fallback (ou deixamos o banco decidir o default)
            const columnColor = color || '#E2E8F0'; 

            const newColumn = await columnRepository.create(userId, title, columnColor);
            
            return res.status(201).json(newColumn);
        } catch (error) {
            console.error('Erro ao criar coluna:', error);
            return res.status(500).json({ error: 'Erro interno ao criar a coluna.' });
        }
    }

    // GET /api/columns/board
    async getBoard(req, res) {
        try {
            const userId = req.user.id;
            const board = await columnRepository.getFullBoard(userId);
            
            return res.status(200).json(board);
        } catch (error) {
            console.error('Erro ao carregar o quadro:', error);
            return res.status(500).json({ error: 'Erro interno ao carregar o quadro.' });
        }
    }

    // PATCH /api/columns/:id
    async update(req, res) {
        try {
            const columnId = req.params.id;
            const userId = req.user.id;
            const { title, color } = req.body;

            const updated = await columnRepository.update(columnId, userId, title, color);

            if (!updated) {
                return res.status(404).json({ error: 'Coluna não encontrada.' });
            }

            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar coluna.' });
        }
    }

    // DELETE /api/columns/:id
    async delete(req, res) {
        try {
            const columnId = req.params.id;
            const userId = req.user.id;
            
            const deletedColumn = await columnRepository.delete(columnId, userId);

            if (!deletedColumn) {
                return res.status(404).json({ error: 'Coluna não encontrada ou acesso negado.' });
            }

            return res.status(200).json({ message: 'Coluna deletada com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar coluna:', error);
            return res.status(500).json({ error: 'Erro interno ao deletar a coluna.' });
        }
    }
}

module.exports = new ColumnController();