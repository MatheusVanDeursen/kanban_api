const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const columnRoutes = require('./routes/columnRoutes');
const cardRoutes = require('./routes/cardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Registrando as rotas de usuários
app.use('/api/users', userRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/cards', cardRoutes);

module.exports = app;