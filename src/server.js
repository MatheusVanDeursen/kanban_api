const app = require('./app');
const db = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    try {
        const res = await db.query('SELECT NOW()');
        console.log('Conectado ao PostgreSQL com sucesso:', res.rows[0].now);
    } catch (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
    }
});