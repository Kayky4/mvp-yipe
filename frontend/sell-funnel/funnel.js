// // dashboard/sales-funnel/funnel.js

// document.addEventListener("DOMContentLoaded", () => {
//     const addStageBtn = document.getElementById("addStageBtn");
//     const addStageModal = document.getElementById("addStageModal");
//     const renameStageModal = document.getElementById("renameStageModal");
//     const addContentModal = document.getElementById("addContentModal");
//     const contentInputText = document.getElementById("contentInputText");
//     const fileUploadWrapper = document.getElementById("fileUploadWrapper");
//     const contentInputFile = document.getElementById("contentInputFile");
//     const fileNamePreview = document.getElementById("fileNamePreview");
//     let confirmAddContentBtn = document.getElementById("confirmAddContent");

//     const originalTextareaHeight = contentInputText.style.height || '50px'; // Altura original do textarea

//     let currentStageElement = null;
//     let currentContentElement = null;
//     let contentType = ''; // Armazena o tipo de conteúdo atual

//     // Ajustar altura do textarea conforme o texto inserido
//     contentInputText.addEventListener('input', autoResizeTextarea);

//     // Voltar o textarea ao tamanho original quando perder o foco
//     contentInputText.addEventListener('blur', resetTextareaHeight);

//     function autoResizeTextarea() {
//         contentInputText.style.height = 'auto'; // Resetar a altura
//         contentInputText.style.height = `${contentInputText.scrollHeight}px`; // Ajustar conforme o conteúdo
//     }

//     function resetTextareaHeight() {
//         if (contentInputText.value.trim() === '') {
//             contentInputText.style.height = originalTextareaHeight; // Voltar para a altura original
//         }
//     }

//     // Abrir modal para adicionar etapa
//     addStageBtn.addEventListener("click", () => {
//         addStageModal.style.display = "flex";
//     });

//     // Fechar modal ao clicar em "x"
//     document.querySelectorAll(".close").forEach(closeBtn => {
//         closeBtn.addEventListener("click", () => {
//             closeBtn.closest(".modal").style.display = "none";
//             clearModals();
//         });
//     });

//     // Confirmar adição de etapa
//     document.getElementById("confirmAddStage").addEventListener("click", () => {
//         const stageNameInput = document.getElementById("stageNameInput");
//         const stageNameError = document.getElementById("stageNameError");

//         if (stageNameInput.value.trim() === "") {
//             stageNameError.textContent = "O nome da etapa não pode ser vazio.";
//             stageNameError.style.display = "block";
//         } else {
//             stageNameError.style.display = "none";
//             addStage(stageNameInput.value.trim());
//             addStageModal.style.display = "none";
//             clearModals();
//         }
//     });

//     // Função para adicionar uma nova etapa
//     function addStage(stageName) {
//         const stageItem = document.createElement("div");
//         stageItem.className = "accordion-item";
//         stageItem.innerHTML = `
//             <div class="accordion-header">
//                 <span class="accordion-title">${stageName}</span>
//                 <div class="accordion-actions">
//                     <button class="rename-stage btn btn-link p-0"><i class="fas fa-edit"></i></button>
//                     <button class="delete-stage btn btn-link p-0"><i class="fas fa-trash-alt"></i></button>
//                     <div class="dropup-center dropup">
//                         <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                             <i class="fas fa-plus"></i>
//                         </button>
//                         <ul class="dropdown-menu">
//                             <li><a class="dropdown-item add-message" href="#">Add. Mensagem</a></li>
//                             <li><a class="dropdown-item add-audio" href="#">Add. Áudio</a></li>
//                             <li><a class="dropdown-item add-image" href="#">Add. Imagem</a></li>
//                             <li><a class="dropdown-item add-video" href="#">Add. Vídeo</a></li>
//                             <li><a class="dropdown-item add-document" href="#">Add. Documento</a></li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//             <div class="accordion-content"></div>
//         `;
        
//         // Adicionar funcionalidade ao accordion para expandir e esconder o conteúdo
//         const header = stageItem.querySelector('.accordion-header');
//         const content = stageItem.querySelector('.accordion-content');

//         header.addEventListener('click', () => {
//             content.style.display = content.style.display === 'block' ? 'none' : 'block';
//         });

//         // Prevenir a propagação do clique do dropdown para o accordion
//         stageItem.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
//             e.stopPropagation(); // Impede que o clique no dropdown afete o accordion
//         });

//         // Adicionar listeners para as ações de renomear, excluir e adicionar conteúdo
//         stageItem.querySelector(".rename-stage").addEventListener("click", () => renameStage(stageItem));
//         stageItem.querySelector(".delete-stage").addEventListener("click", () => deleteStage(stageItem));
        
//         stageItem.querySelectorAll(".dropdown-item").forEach(contentLink => {
//             contentLink.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 contentType = contentLink.textContent.split(' ')[1].toLowerCase(); // Captura o tipo de conteúdo (mensagem, áudio, etc.)
//                 prepareContentModal(contentType, stageItem);
//                 addContentModal.style.display = "flex";
//             });
//         });

//         salesFunnelAccordion.appendChild(stageItem);
//     }

//     // Função para preparar o modal de acordo com o tipo de conteúdo
//     function prepareContentModal(type, stageItem) {
//         currentStageElement = stageItem; // Define a etapa atual

//         if (type === 'mensagem') {
//             contentInputText.style.display = 'block';
//             fileUploadWrapper.style.display = 'none';
//             resetTextareaHeight(); // Ajusta a altura do textarea ao abrir o modal
//         } else {
//             contentInputText.style.display = 'none';
//             fileUploadWrapper.style.display = 'block';
//             fileNamePreview.textContent = ''; // Limpa a pré-visualização do arquivo
//             contentInputFile.value = ''; // Limpa o campo de arquivo

//             contentInputFile.setAttribute('accept', `${type}/*`); // Define o tipo de arquivo aceito
//             contentInputFile.addEventListener('change', () => {
//                 const file = contentInputFile.files[0];
//                 if (file) {
//                     fileNamePreview.textContent = file.name;
//                 }
//             });
//         }

//         // Remover qualquer listener anterior do botão de adicionar
//         const newConfirmButton = confirmAddContentBtn.cloneNode(true);
//         confirmAddContentBtn.parentNode.replaceChild(newConfirmButton, confirmAddContentBtn);
//         confirmAddContentBtn = newConfirmButton;

//         // Adicionar conteúdo ao clicar no botão "Adicionar"
//         confirmAddContentBtn.addEventListener("click", () => addContentToStage(type));
//     }

//     // Função para adicionar conteúdo à etapa
//     function addContentToStage(type) {
//         const content = type === 'mensagem' ? contentInputText.value.trim() : contentInputFile.files[0];

//         if (content) {
//             const contentDiv = document.createElement("div");
//             contentDiv.className = "content-item";

//             if (type === 'mensagem') {
//                 contentDiv.innerHTML = `
//                     <p><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${content}</p>
//                 `;
//             } else {
//                 let fileURL = URL.createObjectURL(content);
//                 let fileElement;

//                 if (type === 'imagem' || type === 'documento') {
//                     fileElement = document.createElement('img');
//                     fileElement.src = fileURL;
//                 } else if (type === 'áudio') {
//                     fileElement = document.createElement('audio');
//                     fileElement.controls = true;
//                     fileElement.src = fileURL;
//                 } else if (type === 'vídeo') {
//                     fileElement = document.createElement('video');
//                     fileElement.controls = true;
//                     fileElement.src = fileURL;
//                 }

                
//                 const fileName = document.createElement('p');
                
//                 fileName.innerHTML = `<strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${content.name}`;
//                 contentDiv.appendChild(fileName);
//                 contentDiv.appendChild(fileElement);
//             }

//             contentDiv.innerHTML += `
//                 <div class="buttons-edit-content">
//                     <button class="edit-content btn btn-link p-0"><i class="fas fa-edit"></i></button>
//                     <button class="delete-content btn btn-link p-0"><i class="fas fa-trash-alt"></i></button>
//                 <div>
//             `;

//             // Adicionar listeners de edição e exclusão
//             contentDiv.querySelector(".edit-content").addEventListener("click", () => editContent(contentDiv));
//             contentDiv.querySelector(".delete-content").addEventListener("click", () => deleteContent(contentDiv));

//             currentStageElement.querySelector(".accordion-content").appendChild(contentDiv);
//             currentStageElement.querySelector(".accordion-content").style.display = "block";
//             addContentModal.style.display = "none";
//             clearModals();
//         }
//     }

//     // Função para editar conteúdo
//     function editContent(contentDiv) {
//         currentContentElement = contentDiv;
//         const contentType = contentDiv.querySelector("p").textContent.split(":")[0].toLowerCase();
//         prepareContentModal(contentType, currentStageElement);

//         if (contentType === 'mensagem') {
//             const contentInput = document.getElementById("contentInputText");
//             contentInput.value = contentDiv.querySelector("p").textContent.split(": ")[1]; // Preencher o campo com o texto da mensagem
//             autoResizeTextarea(); // Ajusta a altura do textarea ao carregar o conteúdo para edição
//         } else {
//             fileNamePreview.textContent = contentDiv.querySelector("p").textContent.split(": ")[1];
//         }

//         addContentModal.style.display = "flex";

//         const newConfirmButton = confirmAddContentBtn.cloneNode(true);
//         confirmAddContentBtn.parentNode.replaceChild(newConfirmButton, confirmAddContentBtn);
//         confirmAddContentBtn = newConfirmButton;

//         confirmAddContentBtn.addEventListener("click", () => {
//             if (contentType === 'mensagem') {
//                 const contentInput = document.getElementById("contentInputText");
//                 if (contentInput.value.trim() !== "") {
//                     contentDiv.querySelector("p").innerHTML = `<strong>${contentType.charAt(0).toUpperCase() + contentType.slice(1)}:</strong> ${contentInput.value.trim()}`;
//                     addContentModal.style.display = "none";
//                     clearModals();
//                 }
//             } else {
//                 const file = contentInputFile.files[0];
//                 if (file) {
//                     const fileURL = URL.createObjectURL(file);
//                     contentDiv.querySelector("img, audio, video").src = fileURL;
//                     contentDiv.querySelector("p").innerHTML = `<strong>${contentType.charAt(0).toUpperCase() + contentType.slice(1)}:</strong> ${file.name}`;
//                     addContentModal.style.display = "none";
//                     clearModals();
//                 }
//             }
//         });
//     }

//     // Função para excluir conteúdo
//     function deleteContent(contentDiv) {
//         if (confirm("Tem certeza de que deseja excluir este conteúdo?")) {
//             contentDiv.remove();
//         }
//     }

//     // Função para renomear uma etapa
//     function renameStage(stageItem) {
//         const renameStageInput = document.getElementById("renameStageInput");
//         const renameStageError = document.getElementById("renameStageError");

//         currentStageElement = stageItem;

//         renameStageInput.value = stageItem.querySelector(".accordion-title").textContent;
//         renameStageModal.style.display = "flex";

//         document.getElementById("confirmRenameStage").addEventListener("click", () => {
//             if (renameStageInput.value.trim() === "") {
//                 renameStageError.textContent = "O nome da etapa não pode ser vazio.";
//                 renameStageError.style.display = "block";
//             } else {
//                 renameStageError.style.display = "none";
//                 stageItem.querySelector(".accordion-title").textContent = renameStageInput.value.trim();
//                 renameStageModal.style.display = "none";
//                 clearModals();
//             }
//         }, { once: true });
//     }

//     // Função para excluir uma etapa
//     function deleteStage(stageItem) {
//         if (confirm("Tem certeza de que deseja excluir esta etapa?")) {
//             stageItem.remove();
//         }
//     }

//     // Função para limpar os campos e mensagens de erro dos modais
//     function clearModals() {
//         document.getElementById("stageNameInput").value = "";
//         document.getElementById("renameStageInput").value = "";
//         document.getElementById("contentInputText").value = "";
//         contentInputFile.value = "";
//         fileNamePreview.textContent = "";
//         document.getElementById("stageNameError").style.display = "none";
//         document.getElementById("renameStageError").style.display = "none";
//     }
// });



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
    let currentStageElement = null;
    let contentType = ''; // Armazena o tipo de conteúdo atual

    const originalTextareaHeight = contentInputText.style.height || '50px'; // Altura original do textarea

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

    // Função para carregar etapas e seus conteúdos do backend ao iniciar a página
    async function loadStages() {
        const token = localStorage.getItem('token');
        if (!token) {
            redirectToLogin();
            return;
        }

        try {
            const response = await fetch('http://localhost:3016/api/pipeline/stages', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                data.forEach(stage => {
                    renderStage(stage);
                });
            } else if (data.error && data.error.includes('Token inválido')) {
                redirectToLogin();
            } else {
                console.error('Nenhuma etapa encontrada ou formato de resposta incorreto:', data);
            }
        } catch (err) {
            console.error('Erro ao comunicar com o backend:', err);
        }
    }

    // Função para redirecionar o usuário para a página de login
    function redirectToLogin() {
        alert('Token inválido. Redirecionando para a página de login.');
        window.location.href = '/mvp-yipe/frontend/login/login.html'; // Ajuste este caminho para o correto
    }

    // Função para renderizar uma etapa na interface
    function renderStage(stage) {
        const stageItem = document.createElement("div");
        stageItem.className = "accordion-item";
        stageItem.dataset.stageId = stage.id;
        stageItem.innerHTML = `
            <div class="accordion-header">
                <span class="accordion-title">${stage.name}</span>
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
            <div class="accordion-content" style="display: none;"></div> <!-- Alteração para manter o conteúdo escondido inicialmente -->
        `;

        // Renderizar conteúdos associados à etapa
        if (stage.content) {
            try {
                const content = JSON.parse(stage.content);
                if (Array.isArray(content)) {
                    content.forEach(item => renderContent(stageItem.querySelector(".accordion-content"), item));
                } else {
                    renderContent(stageItem.querySelector(".accordion-content"), content);
                }
            } catch (error) {
                console.error("Erro ao processar o conteúdo da etapa:", error);
            }
        }

        // Adicionar a etapa renderizada ao container do funil
        document.getElementById("salesFunnelAccordion").appendChild(stageItem);

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
    }

    // Função para renderizar conteúdo
    function renderContent(contentContainer, content) {
        const contentDiv = document.createElement("div");
        contentDiv.className = "content-item";

        if (content.text) {
            contentDiv.innerHTML = `
                <p><strong>Mensagem:</strong> ${content.text}</p>
            `;
        } else if (content.file) {
            let fileElement;
            let fileURL = content.file; // Assuming content.file contains the file's base64 or URL

            if (content.type === 'image' || content.type === 'document') {
                fileElement = document.createElement('img');
                fileElement.src = fileURL;
            } else if (content.type === 'audio') {
                fileElement = document.createElement('audio');
                fileElement.controls = true;
                fileElement.src = fileURL;
            } else if (content.type === 'video') {
                fileElement = document.createElement('video');
                fileElement.controls = true;
                fileElement.src = fileURL;
            }

            const fileName = document.createElement('p');
            fileName.innerHTML = `<strong>${content.type.charAt(0).toUpperCase() + content.type.slice(1)}:</strong> ${content.name}`;
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

        contentContainer.appendChild(contentDiv);
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

    // Função para adicionar uma nova etapa e exibi-la na interface
    function addStage(stageName) {
        saveStageToBackend(stageName)
            .then(stage => {
                if (stage) {
                    renderStage(stage); // Renderizar a nova etapa na interface
                }
            })
            .catch(error => console.error("Erro ao salvar etapa no backend:", error));
    }

    // Função para salvar a nova etapa no backend
    async function saveStageToBackend(stageName) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado. Faça login novamente.');
            redirectToLogin();
            return null;
        }

        try {
            const response = await fetch('http://localhost:3016/api/pipeline/stages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: stageName,
                    pipelineId: 1, // Substitua pelo ID real do pipeline, se necessário
                    order: document.querySelectorAll('.accordion-item').length + 1,
                    content: {} // Inicia com conteúdo vazio
                })
            });

            if (response.status === 401) {
                console.error('Token inválido ou expirado. Redirecionando para a página de login.');
                redirectToLogin();
                return null;
            }

            if (response.status === 400) {
                const data = await response.json();
                console.error('Erro na requisição:', data.error);
                return null;
            }

            const data = await response.json();

            if (data && data.stage) {
                return data.stage; // Retorna o objeto da nova etapa criada
            } else {
                console.error('Resposta inesperada do servidor:', data);
                return null;
            }
        } catch (err) {
            console.error('Erro ao comunicar com o backend:', err);
            return null;
        }
    }

    // Função para excluir uma etapa
    async function deleteStage(stageItem) {
        const stageId = stageItem.dataset.stageId;

        console.log('ID da Etapa a ser excluída:', stageId);

        try {
            const response = await fetch(`http://localhost:3016/api/pipeline/stages/${stageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                stageItem.remove(); // Remover a etapa da interface
            } else {
                const data = await response.json();
                console.error('Erro ao excluir etapa:', data.error);
            }
        } catch (err) {
            console.error('Erro ao comunicar com o backend:', err);
        }
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

    // Função para adicionar conteúdo à etapa e enviá-lo ao backend
    function addContentToStage(type) {
        const content = type === 'mensagem' ? contentInputText.value.trim() : contentInputFile.files[0];

        if (content) {
            const stageId = currentStageElement.dataset.stageId;
            saveContentToBackend(stageId, type, content)
                .then(() => {
                    // Lógica para adicionar o conteúdo à interface
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
                })
                .catch(error => console.error("Erro ao salvar conteúdo no backend:", error));
        }
    }

    // Função para salvar o conteúdo no backend
    async function saveContentToBackend(stageId, type, content) {
        const contentData = {};

        if (type === 'mensagem') {
            contentData.text = content;
        } else {
            contentData.file = await fileToBase64(content); // Converte o arquivo para base64
        }

        try {
            const response = await fetch(`http://localhost:3016/api/pipeline/stages/${stageId}/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(contentData)
            });

            if (!response.ok) {
                const data = await response.json();
                console.error(data.error);
                if (data.error && data.error.includes('Token inválido')) {
                    redirectToLogin();
                }
            }
        } catch (err) {
            console.error('Erro ao comunicar com o backend:', err);
        }
    }

    // Função para converter arquivo em base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
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

    // Carregar etapas ao iniciar a página
    loadStages();
});
