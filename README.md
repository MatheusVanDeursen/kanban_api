# Kanban Board API ⚙️

Esta é a API RESTful construída para alimentar o projeto Kanban Board. Desenvolvida em **Node.js** com **Express** e **PostgreSQL**, ela gerencia a autenticação de usuários e a persistência de dados (Colunas e Cards) do quadro de forma segura e eficiente.

---

## 🚀 Principais Tecnologias

- **Node.js** & **Express** → Roteamento e servidor
- **PostgreSQL** & **pg** → Banco de dados relacional e driver nativo
- **JSON Web Token (JWT)** & **Bcrypt** → Autenticação e criptografia de senhas
- **Cors** & **Dotenv** → Segurança e variáveis de ambiente

---

## 🧠 Destaque de Arquitetura: A Lógica do Drag & Drop

Para evitar problemas de performance e *race conditions* ao reordenar cards no banco de dados, esta API não utiliza números inteiros (1, 2, 3) para posições.

Em vez disso, utiliza o padrão de **Isolamento de Estado com FLOAT**.
Quando um card é movido entre dois outros cards, sua nova posição é calculada como a média das posições adjacentes:

(A + B) / 2

Isso permite que a reordenação exija apenas um único `UPDATE` no banco de dados, tornando a API extremamente rápida e preparada para UI otimista.

---

## 🛠️ Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/MatheusVanDeursen/kanban_api
cd kanban-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base nas suas credenciais locais do PostgreSQL:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=kanban_db
DB_PASSWORD=sua_senha
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_aqui
```

### 4. Prepare o banco de dados

Execute o script DDL no seu **pgAdmin** (ou outro cliente SQL) para criar as tabelas:

- users
- columns
- cards

Certifique-se de incluir seus relacionamentos e índices.

### 5. Inicie o servidor

```bash
node src/server.js
```

✅ A API estará rodando em:
http://localhost:3000

