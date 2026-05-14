# Kanban Board API ⚙️

Esta é a API RESTful construída para alimentar o projeto Kanban Board. Desenvolvida em Node.js com Express e PostgreSQL, ela gerencia a autenticação de usuários e a persistência de dados (Colunas e Cards) do quadro de forma segura e eficiente.

## 🚀 Principais Tecnologias
* **Node.js** & **Express** (Roteamento e Servidor)
* **PostgreSQL** & **pg** (Banco de dados relacional e driver nativo)
* **JSON Web Token (JWT)** & **Bcrypt** (Autenticação e criptografia de senhas)
* **Cors** & **Dotenv** (Segurança e variáveis de ambiente)

## 🧠 Destaque de Arquitetura: A Lógica do Drag & Drop
Para evitar problemas de performance e *Race Conditions* ao reordenar cards no banco de dados, esta API não utiliza números inteiros (1, 2, 3) para posições.
Em vez disso, utiliza o padrão de **Isolamento de Estado com FLOAT**. Quando um card é movido entre dois outros cards, sua nova posição é calculada como a média das posições adjacentes `(A + B) / 2`. Isso permite que a reordenação exija um único `UPDATE` no banco de dados, tornando a API extremamente rápida e pronta para UI Otimista.

## 🛠️ Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SeuUsuario/kanban-api.git](https://github.com/SeuUsuario/kanban-api.git)
   cd kanban-api
