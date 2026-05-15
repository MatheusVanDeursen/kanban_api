const cardRepository = require('../repositories/cardRepository');

class CardController {
    // POST /api/cards
    async create(req, res) {
        try {
            const { column_id, title, content } = req.body;

            if (!column_id || !title) {
                return res.status(400).json({ error: 'ID da coluna e título são obrigatórios.' });
            }

            const newCard = await cardRepository.create(column_id, title, content);
            
            return res.status(201).json(newCard);
        } catch (error) {
            console.error('Erro ao criar card:', error);
            return res.status(500).json({ error: 'Erro interno ao criar o card.' });
        }
    }

    // PATCH /api/cards/:id/move
    async move(req, res) {
        try {
            const cardId = req.params.id;
            const { column_id, position } = req.body;

            if (!column_id || position === undefined) {
                return res.status(400).json({ error: 'A nova coluna e a nova posição são obrigatórias.' });
            }

            const updatedCard = await cardRepository.updatePosition(cardId, column_id, position);
            
            if (!updatedCard) {
                return res.status(404).json({ error: 'Card não encontrado.' });
            }

            return res.status(200).json(updatedCard);
        } catch (error) {
            console.error('Erro ao mover card:', error);
            return res.status(500).json({ error: 'Erro interno ao mover o card.' });
        }
    }

    // PATCH /api/cards/:id
    async update(req, res) {
        try {
            const cardId = req.params.id;
            const { title, content } = req.body;

            const updated = await cardRepository.updateText(cardId, title, content);

            if (!updated) {
                return res.status(404).json({ error: 'Card não encontrado.' });
            }

            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar texto do card.' });
        }
    }

    // DELETE /api/cards/:id
    async delete(req, res) {
        try {
            const cardId = req.params.id;
            const deletedCard = await cardRepository.delete(cardId);

            if (!deletedCard) {
                return res.status(404).json({ error: 'Card não encontrado.' });
            }

            return res.status(200).json({ message: 'Card deletado com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar card:', error);
            return res.status(500).json({ error: 'Erro interno ao deletar o card.' });
        }
    }
}

module.exports = new CardController();