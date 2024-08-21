// Função para abrir o modal de histórico de atividades
function openActivityHistoryModal(leadId) {
    const modal = document.createElement('div');
    modal.id = 'activity-history-modal';
    fetch(chrome.runtime.getURL('modals/activityHistoryModal.html'))
        .then(response => response.text())
        .then(data => {
            modal.innerHTML = data;
            document.body.appendChild(modal);
            loadActivityHistory(leadId);
        });
}

// Função para carregar o histórico de atividades do lead
function loadActivityHistory(leadId) {
    fetch(`https://api.yipecrm.com/v1/leads/${leadId}/activities`)
        .then(response => response.json())
        .then(activities => {
            const activityList = document.getElementById('activity-list');
            activities.forEach(activity => {
                const listItem = document.createElement('li');
                listItem.textContent = `${activity.date}: ${activity.description}`;
                activityList.appendChild(listItem);
            });
        });
}

// Modifica o setupDragAndDrop para incluir o botão de histórico de atividades
function setupDragAndDrop() {
    const stagesContainer = document.getElementById('stages-container');
    dragula([].slice.call(stagesContainer.querySelectorAll('.stage'))).on('drop', (el, target, source, sibling) => {
        const leadId = el.getAttribute('data-lead-id');
        const newStageId = target.getAttribute('data-stage-id');

        // Atualiza o estágio do lead via API
        fetch(`https://api.yipecrm.com/v1/leads/${leadId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stage_id: newStageId })
        })
        .then(response => response.json())
        .then(data => {
            showNotification('Lead Movido', `O lead foi movido para a nova etapa com sucesso!`);
            const historyButton = document.createElement('button');
            historyButton.className = 'yipe-history-button';
            historyButton.textContent = 'Histórico';
            historyButton.onclick = () => openActivityHistoryModal(leadId);
            el.appendChild(historyButton);
        })
        .catch(error => {
            console.error('Erro ao mover lead:', error);
            alert('Erro ao mover lead');
        });
    });
}
