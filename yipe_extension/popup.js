document.getElementById('open-funnel-btn').addEventListener('click', openFunnelStagesModal);
document.getElementById('new-lead-btn').addEventListener('click', openNewLeadModal);

function openFunnelStagesModal() {
    // Abre o modal de etapas do funil
    chrome.tabs.executeScript({
        code: 'openFunnelStagesModal();'
    });
}

function openNewLeadModal() {
    chrome.tabs.executeScript({
        code: 'openNewLeadModal();'
    });
}
