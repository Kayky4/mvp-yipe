// notifications.js

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'yipe-notification';
    notification.innerHTML = `
        <div class="yipe-notification-title">${title}</div>
        <div class="yipe-notification-message">${message}</div>
    `;
    document.body.appendChild(notification);

    // Adiciona animação de fade in e fade out
    setTimeout(() => {
        notification.classList.add('fade-in');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('fade-in');
        notification.classList.add('fade-out');
    }, 5000);

    setTimeout(() => {
        notification.remove();
    }, 6000);
}

// Exemplo de uso:
// showNotification('Novo Lead Criado', 'O lead João Silva foi adicionado com sucesso.');
