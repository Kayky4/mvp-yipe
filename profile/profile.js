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
