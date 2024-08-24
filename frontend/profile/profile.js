document.addEventListener('DOMContentLoaded', () => {
    const photoUpload = document.getElementById('photoUpload');
    const currentPhoto = document.getElementById('currentPhoto');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profileForm = document.getElementById('profileForm');
    const addressForm = document.getElementById('addressForm');

    // Alterar foto de perfil
    changePhotoBtn.addEventListener('click', () => {
        photoUpload.click();
    });

    photoUpload.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentPhoto.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Salvar alterações do perfil
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para salvar os dados do perfil
        alert('Alterações do perfil salvas com sucesso!');
    });

    // Salvar alterações do endereço
    addressForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para salvar os dados de endereço
        alert('Alterações de endereço salvas com sucesso!');
    });

    // Alterar senha (por exemplo, redirecionar para outra página)
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    changePasswordBtn.addEventListener('click', () => {
        alert('Funcionalidade para alterar senha ainda não implementada.');
        // Aqui você pode redirecionar para uma página de alteração de senha
    });

    
});

const token = localStorage.getItem('token');

document.getElementById('updateProfileForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const profileImage = document.getElementById('profileImage').value;

    try {
        const response = await fetch('http://localhost:3017/api/auth/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Envia o token JWT no cabeçalho da requisição
            },
            body: JSON.stringify({ fullName, email, phone, profileImage })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Perfil atualizado com sucesso!');
            // Atualize a interface conforme necessário
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
    }
});

