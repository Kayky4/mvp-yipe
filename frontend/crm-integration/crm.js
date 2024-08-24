document.addEventListener('DOMContentLoaded', () => {
    const createLeadBtn = document.getElementById('createLeadBtn');
    const leadModal = document.getElementById('leadModal');
    const closeModalBtn = document.querySelector('.modal .close');
    const leadForm = document.getElementById('leadForm');
    const stages = document.querySelectorAll('.stage');
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const notificationContainer = document.getElementById('notificationContainer');
    const exportCSVBtn = document.getElementById('exportCSVBtn');
    const exportPDFBtn = document.getElementById('exportPDFBtn');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const attachmentPreview = document.getElementById('attachmentPreview');
    const pipelineContainer = document.getElementById('pipelineContainer');
    const filterDropdown = document.getElementById('filterDropdown');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const dropdownMenu = filterDropdown.nextElementSibling;

    const totalLeadsElem = document.getElementById('totalLeads');
    const totalConversionsElem = document.getElementById('totalConversions');
    const logoImage = document.querySelector('.logo-yipe-sidebar img'); // Seleciona a logo

    let leads = [];
    let currentLeadId = null;
    let draggingStage = null;
    let draggingLead = null;

    let clickTimeout;

    function handleLeadClick(leadCard) {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
            if (!draggingLead) {
                const leadId = leadCard.dataset.id;
                openLeadModal(leadId);
            }
        }, 200); // Delay para garantir que é um clique e não um drag
    }

    // Função para arrastar etapas sem interferir nos leads, aplicando a animação
    stages.forEach(stage => {
        stage.setAttribute('draggable', true);

        stage.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('stage')) {
                draggingStage = stage;
                pipelineContainer.classList.add('dragging-stage');
                setTimeout(() => {
                    stage.classList.add('hidden');
                }, 0);
            }
        });

        stage.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggingStage) {
                const afterElement = getDragAfterElement(pipelineContainer, e.clientX);
                if (afterElement == null) {
                    pipelineContainer.appendChild(draggingStage);
                } else {
                    pipelineContainer.insertBefore(draggingStage, afterElement);
                }
                stage.classList.add('stage-drag-over');
            }
        });

        stage.addEventListener('dragleave', () => {
            stage.classList.remove('stage-drag-over');
        });

        stage.addEventListener('dragend', () => {
            if (draggingStage) {
                draggingStage.classList.remove('hidden');
                pipelineContainer.classList.remove('dragging-stage');
                showNotification('A etapa foi movida com sucesso!', 'success');
                draggingStage = null;
                stages.forEach(stage => {
                    stage.classList.remove('stage-drag-over');
                });
            }
        });

        stage.addEventListener('drop', () => {
            stages.forEach(stage => {
                stage.classList.remove('stage-drag-over');
            });
        });
    });

    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll('.stage:not(.hidden)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Função para permitir drag-and-drop de leads sem afetar as etapas
    function enableLeadDragAndDrop() {
        document.querySelectorAll('.lead-card').forEach(leadCard => {
            leadCard.setAttribute('draggable', true);

            leadCard.addEventListener('dragstart', (e) => {
                draggingLead = leadCard;
                e.dataTransfer.setData('text/plain', leadCard.dataset.id);
                setTimeout(() => {
                    leadCard.classList.add('hidden');
                }, 0);
            });

            leadCard.addEventListener('dragend', () => {
                if (draggingLead) {
                    draggingLead.classList.remove('hidden');
                    draggingLead = null;
                }
            });

            leadCard.addEventListener('click', () => {
                handleLeadClick(leadCard);
            });
        });

        stages.forEach(stage => {
            const leadsContainer = stage.querySelector('.leads');

            leadsContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (draggingLead) {
                    leadsContainer.classList.add('lead-drag-over');
                }
            });

            leadsContainer.addEventListener('dragleave', () => {
                leadsContainer.classList.remove('lead-drag-over');
            });

            leadsContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData('text/plain');
                const leadIndex = leads.findIndex(l => l.id === leadId);
                const newStage = stage.dataset.stage;

                leads[leadIndex].stage = newStage;
                renderLeads();
                showNotification('Lead movido com sucesso!', 'success');
                leadsContainer.classList.remove('lead-drag-over');
            });
        });
    }

    function renderLeads() {
        stages.forEach(stage => {
            stage.querySelector('.leads').innerHTML = '';
        });

        leads
            .filter(lead => {
                const searchTerm = searchInput.value.toLowerCase();
                const statusFilter = filterStatus.value;
                const dateFilter = document.getElementById('filterDate').value;
                const valueFilter = document.getElementById('filterValue').value;
                return (
                    (lead.name.toLowerCase().includes(searchTerm) || lead.contact.toLowerCase().includes(searchTerm)) &&
                    (statusFilter === '' || lead.status === statusFilter) &&
                    (dateFilter === '' || lead.dateCreated.includes(dateFilter)) &&
                    (valueFilter === '' || lead.value >= parseFloat(valueFilter))
                );
            })
            .forEach(lead => {
                const leadCard = document.createElement('div');
                leadCard.classList.add('lead-card');
                leadCard.dataset.id = lead.id;

                const timeInStage = calculateTimeInStage(lead.dateCreated);

                leadCard.innerHTML = `
                    <h3>${lead.name}</h3>
                    <p><i class="fas fa-thermometer-half"></i> <span class="status ${lead.status}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span></p>
                    <p><i class="fas fa-money-bill-wave"></i> R$ ${lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p><i class="fas fa-clock"></i> ${timeInStage}</p>
                `;

                const stageContainer = document.getElementById(`${lead.stage}Leads`);
                stageContainer.appendChild(leadCard);
            });

        enableLeadDragAndDrop();
        updateLeadTotals();
    }

    function calculateTimeInStage(dateCreated) {
        const now = new Date();
        const createdDate = new Date(dateCreated);
        const timeDiff = now - createdDate;
        const daysInStage = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        return `${daysInStage}d`;
    }

    function updateLeadTotals() {
        const totals = {
            prospect: 0,
            qualificado: 0,
            proposta: 0,
            fechado: 0
        };

        let totalLeads = leads.length;
        let totalConversions = leads.filter(lead => lead.stage === 'fechado').length;

        totalLeadsElem.textContent = totalLeads;
        totalConversionsElem.textContent = totalConversions;

        leads.forEach(lead => {
            totals[lead.stage] += lead.value;
        });

        document.getElementById('prospectTotal').textContent = `R$ ${totals.prospect.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById('qualificadoTotal').textContent = `R$ ${totals.qualificado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById('propostaTotal').textContent = `R$ ${totals.proposta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById('fechadoTotal').textContent = `R$ ${totals.fechado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    function openLeadModal(id = null) {
        currentLeadId = id;
        attachmentPreview.innerHTML = ''; // Limpa a pré-visualização de anexos
        if (id) {
            const lead = leads.find(l => l.id === id);
            document.getElementById('modalTitle').textContent = 'Editar Lead';
            document.getElementById('leadName').value = lead.name;
            document.getElementById('leadContact').value = lead.contact;
            document.getElementById('leadStatus').value = lead.status;
            document.getElementById('leadValue').value = lead.value;
            document.getElementById('leadStage').value = lead.stage;
            document.getElementById('leadComments').value = lead.comments || '';

            // Exibe os anexos
            if (lead.attachments) {
                lead.attachments.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(file);
                        attachmentPreview.appendChild(img);
                    } else {
                        const fileIcon = document.createElement('div');
                        fileIcon.classList.add('file-icon');
                        fileIcon.innerHTML = '<i class="fas fa-file-alt"></i>';
                        attachmentPreview.appendChild(fileIcon);
                    }
                });
            }

            if (lead.reminder) {
                document.getElementById('leadReminder').value = lead.reminder;
            }
        } else {
            leadForm.reset();
            document.getElementById('modalTitle').textContent = 'Criar Lead';
        }
        leadModal.style.display = 'block';
    }

    function closeLeadModal() {
        leadModal.style.display = 'none';
        currentLeadId = null;
    }

    createLeadBtn.addEventListener('click', () => {
        openLeadModal();
    });

    closeModalBtn.addEventListener('click', closeLeadModal);

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('leadName').value;
        const contact = document.getElementById('leadContact').value;
        const status = document.getElementById('leadStatus').value;
        const value = parseFloat(document.getElementById('leadValue').value);
        const stage = document.getElementById('leadStage').value;
        const comments = document.getElementById('leadComments').value;
        const attachments = Array.from(document.getElementById('leadAttachments').files);
        const reminder = document.getElementById('leadReminder').value;

        if (currentLeadId) {
            const leadIndex = leads.findIndex(l => l.id === currentLeadId);
            leads[leadIndex] = { id: currentLeadId, name, contact, status, value, stage, comments, attachments, reminder, dateCreated: leads[leadIndex].dateCreated };
            showNotification('Lead atualizado com sucesso!', 'success');
        } else {
            const id = Math.random().toString(36).substr(2, 9);
            const dateCreated = new Date().toISOString();
            leads.push({ id, name, contact, status, value, stage, comments, attachments, reminder, dateCreated });
            showNotification('Lead criado com sucesso!', 'success');
        }

        renderLeads();
        closeLeadModal();
    });

    // Exibir/ocultar dropdown de filtros avançados
    filterDropdown.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    filterDropdown.addEventListener('click', () => {
        // console.log('Dropdown clicked'); // Verifica se o evento está disparando
        dropdownMenu.classList.toggle('show');
    });
    

    // Fechar o dropdown ao clicar fora dele, mas não dentro dele
    window.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    applyFiltersBtn.addEventListener('click', () => {
        renderLeads();
    });

    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.classList.add('notification');
        if (type === 'error') {
            notification.classList.add('error');
        }
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = 1;
        }, 100);
        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    function exportToCSV() {
        const csvRows = [];
        const headers = ['Nome do Lead', 'Contato', 'Status', 'Valor', 'Etapa', 'Data de Criação', 'Comentários'];
        csvRows.push(headers.join(','));

        leads.forEach(lead => {
            const row = [
                lead.name,
                lead.contact,
                lead.status,
                lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                lead.stage,
                new Date(lead.dateCreated).toLocaleDateString('pt-BR'),
                `"${lead.comments || ''}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'leads.csv');
        a.click();
    }

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text('Relatório de Leads', 20, 20);
        let y = 30;

        leads.forEach((lead, index) => {
            doc.text(`Lead ${index + 1}: ${lead.name}`, 20, y);
            doc.text(`Contato: ${lead.contact}`, 20, y + 10);
            doc.text(`Status: ${lead.status}`, 20, y + 20);
            doc.text(`Valor: R$ ${lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, y + 30);
            doc.text(`Etapa: ${lead.stage}`, 20, y + 40);
            doc.text(`Data de Criação: ${new Date(lead.dateCreated).toLocaleDateString('pt-BR')}`, 20, y + 50);
            doc.text(`Comentários: ${lead.comments || ''}`, 20, y + 60);
            y += 70;
        });

        doc.save('leads.pdf');
    }

    exportCSVBtn.addEventListener('click', exportToCSV);
    exportPDFBtn.addEventListener('click', exportToPDF);

    searchInput.addEventListener('input', renderLeads);
    filterStatus.addEventListener('change', renderLeads);

    // Alternância de Tema
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //     document.body.className = `theme-${savedTheme}`;
    //     themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    //     logoImage.src = savedTheme === 'dark' ? '/assets/images/logo-back-black.svg' : '/assets/images/logo-back-white.svg';
    // } else {
    //     // Define o tema padrão como claro, se não houver nada no localStorage
    //     document.body.className = 'theme-light';
    //     themeIcon.className = 'fas fa-moon';
    //     logoImage.src = '/assets/images/logo-back-white.svg';
    // }

    // themeToggle.addEventListener('click', () => {
    //     const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    //     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    //     document.body.className = `theme-${newTheme}`;
    //     themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    //     logoImage.src = newTheme === 'dark' ? '/assets/images/logo-back-black.svg' : '/assets/images/logo-back-white.svg';

    //     localStorage.setItem('theme', newTheme);
    // });

    renderLeads();
});

// Pega o token JWT armazenado após o login
const token = localStorage.getItem('token');

// Usa o token JWT na requisição para buscar leads do CRM
fetch('http://localhost:3017/api/crm/leads', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`  // Envia o token JWT no cabeçalho da requisição
    }
}).then(response => response.json())
  .then(data => {
      // Lida com os dados recebidos
      console.log(data);
      // Código para exibir os leads na interface
  })
  .catch(err => console.error('Erro ao buscar leads:', err));
