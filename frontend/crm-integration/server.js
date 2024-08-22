// server.js (Back-End)

const express = require('express');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

const app = express();

let leads = [
    // Exemplo de leads, você pode conectar a um banco de dados real mais tarde.
    {
        id: 'lead1',
        name: 'Oportunidade Google',
        contact: 'Sundar Pichai',
        status: 'frio',
        value: 200000,
        stage: 'prospect',
        dateCreated: new Date().toISOString()
    },
    // Adicione mais leads aqui
];

// Configuração do Nodemailer para envio de e-mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaykyfonseca4@gmail.com', // Substitua pelo seu e-mail
        pass: '1234' // Substitua pela sua senha
    }
});

// Função para enviar e-mails de acompanhamento
function sendFollowUpEmail(lead) {
    const mailOptions = {
        from: 'seu-email@gmail.com',
        to: lead.contact, // Endereço de e-mail do contato
        subject: `Acompanhamento do Lead: ${lead.name}`,
        text: `Olá ${lead.contact},\n\nEstamos acompanhando o status do seu lead.\n\nObrigado, \nEquipe de Vendas`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}

// Agendamento de tarefas automáticas
schedule.scheduleJob('0 9 * * *', function () { // Executa todo dia às 9h
    leads.forEach(lead => {
        const daysInStage = calculateDaysInStage(lead.dateCreated);

        if (daysInStage > 14 && lead.status === 'frio') {
            sendFollowUpEmail(lead);
        }

        // Adicione mais regras de automação aqui
    });
});

function calculateDaysInStage(dateCreated) {
    const now = new Date();
    const createdDate = new Date(dateCreated);
    const timeDiff = now - createdDate;
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
