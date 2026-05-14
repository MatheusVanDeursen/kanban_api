# Kanban Board API ⚙️

Esta é a API RESTful construída para alimentar o projeto Kanban Board. Desenvolvida em **Node.js**, **Express** e **PostgreSQL**, ela gerencia toda a lógica de negócios, incluindo autenticação avançada de usuários e persistência de dados do quadro de forma segura e eficiente.

---

## 🚀 Principais Tecnologias

- **Node.js** & **Express** → Roteamento e servidor
- **PostgreSQL** & **pg** → Banco de dados relacional com uso de UUIDs
- **JSON Web Token (JWT)** & **Bcrypt** → Autenticação local e criptografia
- **Google Auth Library** → Validação stateless de login social
- **Nodemailer** → Serviço de e-mails transacionais

---

## ✨ Funcionalidades do Backend

- **Autenticação híbrida:** Suporte a login tradicional (e-mail/senha) e login social com Google (OAuth 2.0)
- **Recuperação de conta:** Sistema completo de redefinição de senha com tokens temporários gerados via `crypto` e enviados por e-mail
- **Sistema de notificações:** Envio automático de e-mails de boas-vindas
- **Arquitetura de reordenação otimizada:** Utiliza **Isolamento de Estado com FLOAT** para movimentação de cards
  - Em vez de sobrescrever posições inteiras, novos valores são calculados como:
    ```text
    (A + B) / 2
    ```
  - Isso permite apenas um `UPDATE` por operação de drag & drop, garantindo alta performance

---

## 🛠️ Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/SeuUsuario/kanban-api.git
cd kanban-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=kanban_db
DB_PASSWORD=sua_senha_do_banco
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_jwt
GOOGLE_CLIENT_ID=seu_client_id_do_google
EMAIL_USER=seu_email_profissional@gmail.com
EMAIL_PASS=sua_senha_de_app_do_google
```

### 4. Inicie o servidor

```bash
node src/server.js
```

---
