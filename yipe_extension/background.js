// background.js

// Configuração de notificações
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name.startsWith('lead-reminder')) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Lembrete de Follow-up',
            message: `Você tem um follow-up para o lead: ${alarm.name.split('-')[2]}`
        });
    }
});

// Agendamento de lembretes (exemplo)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'setReminder') {
        chrome.alarms.create(`lead-reminder-${request.leadId}`, {
            when: Date.now() + request.remindIn
        });
        sendResponse({ status: 'Lembrete configurado' });
    }
});
