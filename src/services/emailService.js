const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configura o "carteiro" usando as credenciais do seu Gmail
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendWelcomeEmail(userEmail) {
        try {
            const mailOptions = {
                from: `"Kanban App" <${process.env.EMAIL_USER}>`, 
                to: userEmail,
                subject: 'Bem-vindo ao seu novo Quadro Kanban! 🎉',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                        <h2 style="color: #e6b905;">Olá! Bem-vindo ao Kanban.</h2>
                        <p>Sua conta foi criada com sucesso. Fico muito feliz que você resolveu testar o meu app.</p>
                        <p>
                            Criei esse aplicativo com o objetivo de testar novas tecnologias enquanto criava uma ferramenta de produtividade que iria me ajudar a organizar meu trabalho.
                            Eu literalmente usei o Kanban para me ajudar a desenvolver o próprio Kanban! E espero que ele te ajude também. Qualquer feedback é super bem-vindo e se possível,
                            me ajudaria bastante se você pudesse favoritar o projeto no GitHub: <a href="https://github.com/matheusvandeursen/kanban-api" target="_blank">Kanban App</a>
                            e me seguisse no linkedin: <a href="https://www.linkedin.com/in/matheusvandeursen/" target="_blank">Matheus van Deursen</a>.
                        </p>
                        <br>
                        <p>Bons projetos!</p>
                        <p><strong>Matheus van Deursen</strong></p>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-mail enviado com sucesso: ' + info.response);
            return info;
        } catch (error) {
            console.error('Erro ao enviar e-mail de boas-vindas com Nodemailer:', error);
            return null; 
        }
    }
}

module.exports = new EmailService();