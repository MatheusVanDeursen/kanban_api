const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // 1. Pega o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    // O padrão da web é enviar o token no formato: "Bearer seu_token_aqui"
    // Vamos separar a palavra "Bearer" do token em si
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato de token inválido.' });
    }

    const token = parts[1];

    try {
        // 2. Verifica se o token foi gerado pela sua aplicação e se não expirou
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Pendura o ID do usuário dentro do objeto `req`
        // Assim, qualquer Controller que for rodar depois daqui saberá exatamente QUAL usuário fez o pedido
        req.user = { id: decoded.id };

        // 4. Manda a requisição seguir o fluxo normal dela
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};