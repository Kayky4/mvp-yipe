// dashboard/sales-funnel/funnel.js

document.addEventListener("DOMContentLoaded", () => {
    const addStageBtn = document.getElementById("addStageBtn");
    const addStageModal = document.getElementById("addStageModal");
    const renameStageModal = document.getElementById("renameStageModal");
    const addContentModal = document.getElementById("addContentModal");
    const contentInputText = document.getElementById("contentInputText");
    const fileUploadWrapper = document.getElementById("fileUploadWrapper");
    const contentInputFile = document.getElementById("contentInputFile");
    const fileNamePreview = document.getElementById("fileNamePreview");
    let confirmAddContentBtn = document.getElementById("confirmAddContent");

    const originalTextareaHeight = contentInputText.style.height || '50px'; // Altura original do textarea

    let currentStageElement = null;
    let currentContentElement = null;
    let contentType = ''; // Armazena o tipo de conteúdo atual

    // Ajustar altura do textarea conforme o texto inserido
    contentInputText.addEventListener('input', autoResizeTextarea);

    // Voltar o textarea ao tamanho original quando perder o foco
    contentInputText.addEventListener('blur', resetTextareaHeight);

    function autoResizeTextarea() {
        contentInputText.style.height = 'auto'; // Resetar a altura
        contentInputText.style.height = `${contentInputText.scrollHeight}px`; // Ajustar conforme o conteúdo
    }

    function resetTextareaHeight() {
        if (contentInputText.value.trim() === '') {
            contentInputText.style.height = originalTextareaHeight; // Voltar para a altura original
        }
    }

    // Abrir modal para adicionar etapa
    addStageBtn.addEventListener("click", () => {
        addStageModal.style.display = "flex";
    });

    // Fechar modal ao clicar em "x"
    document.querySelectorAll(".close").forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            closeBtn.closest(".modal").style.display = "none";
            clearModals();
        });
    });

    // Confirmar adição de etapa
    document.getElementById("confirmAddStage").addEventListener("click", () => {
        const stageNameInput = document.getElementById("stageNameInput");
        const stageNameError = document.getElementById("stageNameError");

        if (stageNameInput.value.trim() === "") {
            stageNameError.textContent = "O nome da etapa não pode ser vazio.";
            stageNameError.style.display = "block";
        } else {
            stageNameError.style.display = "none";
            addStage(stageNameInput.value.trim());
            addStageModal.style.display = "none";
            clearModals();
        }
    });

    // Função para adicionar uma nova etapa
    function addStage(stageName) {
        const stageItem = document.createElement("div");
        stageItem.className = "accordion-item";
        stageItem.innerHTML = `
            <div class="accordion-header">
                <span class="accordion-title">${stageName}</span>
                <div class="accordion-actions">
                    <button class="rename-stage btn btn-link p-0"><i class="fas fa-edit"></i></button>
                    <button class="delete-stage btn btn-link p-0"><i class="fas fa-trash-alt"></i></button>
                    <div class="dropup-center dropup">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-plus"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item add-message" href="#">Add. Mensagem</a></li>
                            <li><a class="dropdown-item add-audio" href="#">Add. Áudio</a></li>
                            <li><a class="dropdown-item add-image" href="#">Add. Imagem</a></li>
                            <li><a class="dropdown-item add-video" href="#">Add. Vídeo</a></li>
                            <li><a class="dropdown-item add-document" href="#">Add. Documento</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="accordion-content"></div>
        `;
        
        // Adicionar funcionalidade ao accordion para expandir e esconder o conteúdo
        const header = stageItem.querySelector('.accordion-header');
        const content = stageItem.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });

        // Prevenir a propagação do clique do dropdown para o accordion
        stageItem.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
            e.stopPropagation(); // Impede que o clique no dropdown afete o accordion
        });

        // Adicionar listeners para as ações de renomear, excluir e adicionar conteúdo
        stageItem.querySelector(".rename-stage").addEventListener("click", () => renameStage(stageItem));
        stageItem.querySelector(".delete-stage").addEventListener("click", () => deleteStage(stageItem));
        
        stageItem.querySelectorAll(".dropdown-item").forEach(contentLink => {
            contentLink.addEventListener("click", (e) => {
                e.preventDefault();
                contentType = contentLink.textContent.split(' ')[1].toLowerCase(); // Captura o tipo de conteúdo (mensagem, áudio, etc.)
                prepareContentModal(contentType, stageItem);
                addContentModal.style.display = "flex";
            });
        });

        salesFunnelAccordion.appendChild(stageItem);
    }

    // Função para preparar o modal de acordo com o tipo de conteúdo
    function prepareContentModal(type, stageItem) {
        currentStageElement = stageItem; // Define a etapa atual

        if (type === 'mensagem') {
            contentInputText.style.display = 'block';
            fileUploadWrapper.style.display = 'none';
            resetTextareaHeight(); // Ajusta a altura do textarea ao abrir o modal
        } else {
            contentInputText.style.display = 'none';
            fileUploadWrapper.style.display = 'block';
            fileNamePreview.textContent = ''; // Limpa a pré-visualização do arquivo
            contentInputFile.value = ''; // Limpa o campo de arquivo

            contentInputFile.setAttribute('accept', `${type}/*`); // Define o tipo de arquivo aceito
            contentInputFile.addEventListener('change', () => {
                const file = contentInputFile.files[0];
                if (file) {
                    fileNamePreview.textContent = file.name;
                }
            });
        }

        // Remover qualquer listener anterior do botão de adicionar
        const newConfirmButton = confirmAddContentBtn.cloneNode(true);
        confirmAddContentBtn.parentNode.replaceChild(newConfirmButton, confirmAddContentBtn);
        confirmAddContentBtn = newConfirmButton;

        // Adicionar conteúdo ao clicar no botão "Adicionar"
        confirmAddContentBtn.addEventListener("click", () => addContentToStage(type));
    }

    // Função para adicionar conteúdo à etapa
    function addContentToStage(type) {
        const content = type === 'mensagem' ? contentInputText.value.trim() : contentInputFile.files[0];

        if (content) {
            const contentDiv = document.createElement("div");
            contentDiv.className = "content-item";

            if (type === 'mensagem') {
                contentDiv.innerHTML = `
                    <p><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${content}</p>
                `;
            } else {
                let fileURL = URL.createObjectURL(content);
                let fileElement;

                if (type === 'imagem' || type === 'documento') {
                    fileElement = document.createElement('img');
                    fileElement.src = fileURL;
                } else if (type === 'áudio') {
                    fileElement = document.createElement('audio');
                    fileElement.controls = true;
                    fileElement.src = fileURL;
                } else if (type === 'vídeo') {
                    fileElement = document.createElement('video');
                    fileElement.controls = true;
                    fileElement.src = fileURL;
                }

                
                const fileName = document.createElement('p');
                
                fileName.innerHTML = `<strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${content.name}`;
                contentDiv.appendChild(fileName);
                contentDiv.appendChild(fileElement);
            }

            contentDiv.innerHTML += `
                <div class="buttons-edit-content">
                    <button class="edit-content btn btn-link p-0"><i class="fas fa-edit"></i></button>
                    <button class="delete-content btn btn-link p-0"><i class="fas fa-trash-alt"></i></button>
                <div>
            `;

            // Adicionar listeners de edição e exclusão
            contentDiv.querySelector(".edit-content").addEventListener("click", () => editContent(contentDiv));
            contentDiv.querySelector(".delete-content").addEventListener("click", () => deleteContent(contentDiv));

            currentStageElement.querySelector(".accordion-content").appendChild(contentDiv);
            currentStageElement.querySelector(".accordion-content").style.display = "block";
            addContentModal.style.display = "none";
            clearModals();
        }
    }

    // Função para editar conteúdo
    function editContent(contentDiv) {
        currentContentElement = contentDiv;
        const contentType = contentDiv.querySelector("p").textContent.split(":")[0].toLowerCase();
        prepareContentModal(contentType, currentStageElement);

        if (contentType === 'mensagem') {
            const contentInput = document.getElementById("contentInputText");
            contentInput.value = contentDiv.querySelector("p").textContent.split(": ")[1]; // Preencher o campo com o texto da mensagem
            autoResizeTextarea(); // Ajusta a altura do textarea ao carregar o conteúdo para edição
        } else {
            fileNamePreview.textContent = contentDiv.querySelector("p").textContent.split(": ")[1];
        }

        addContentModal.style.display = "flex";

        const newConfirmButton = confirmAddContentBtn.cloneNode(true);
        confirmAddContentBtn.parentNode.replaceChild(newConfirmButton, confirmAddContentBtn);
        confirmAddContentBtn = newConfirmButton;

        confirmAddContentBtn.addEventListener("click", () => {
            if (contentType === 'mensagem') {
                const contentInput = document.getElementById("contentInputText");
                if (contentInput.value.trim() !== "") {
                    contentDiv.querySelector("p").innerHTML = `<strong>${contentType.charAt(0).toUpperCase() + contentType.slice(1)}:</strong> ${contentInput.value.trim()}`;
                    addContentModal.style.display = "none";
                    clearModals();
                }
            } else {
                const file = contentInputFile.files[0];
                if (file) {
                    const fileURL = URL.createObjectURL(file);
                    contentDiv.querySelector("img, audio, video").src = fileURL;
                    contentDiv.querySelector("p").innerHTML = `<strong>${contentType.charAt(0).toUpperCase() + contentType.slice(1)}:</strong> ${file.name}`;
                    addContentModal.style.display = "none";
                    clearModals();
                }
            }
        });
    }

    // Função para excluir conteúdo
    function deleteContent(contentDiv) {
        if (confirm("Tem certeza de que deseja excluir este conteúdo?")) {
            contentDiv.remove();
        }
    }

    // Função para renomear uma etapa
    function renameStage(stageItem) {
        const renameStageInput = document.getElementById("renameStageInput");
        const renameStageError = document.getElementById("renameStageError");

        currentStageElement = stageItem;

        renameStageInput.value = stageItem.querySelector(".accordion-title").textContent;
        renameStageModal.style.display = "flex";

        document.getElementById("confirmRenameStage").addEventListener("click", () => {
            if (renameStageInput.value.trim() === "") {
                renameStageError.textContent = "O nome da etapa não pode ser vazio.";
                renameStageError.style.display = "block";
            } else {
                renameStageError.style.display = "none";
                stageItem.querySelector(".accordion-title").textContent = renameStageInput.value.trim();
                renameStageModal.style.display = "none";
                clearModals();
            }
        }, { once: true });
    }

    // Função para excluir uma etapa
    function deleteStage(stageItem) {
        if (confirm("Tem certeza de que deseja excluir esta etapa?")) {
            stageItem.remove();
        }
    }

    // Função para limpar os campos e mensagens de erro dos modais
    function clearModals() {
        document.getElementById("stageNameInput").value = "";
        document.getElementById("renameStageInput").value = "";
        document.getElementById("contentInputText").value = "";
        contentInputFile.value = "";
        fileNamePreview.textContent = "";
        document.getElementById("stageNameError").style.display = "none";
        document.getElementById("renameStageError").style.display = "none";
    }
});
