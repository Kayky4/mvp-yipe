document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarIcon = document.getElementById('sidebarIcon');
    const logoImage = document.getElementById('logoImage');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Caminhos das logos
    const logos = {
        light: {
            expanded: '/assets/images/logo-back-white.svg',
            collapsed: '/assets/images/logo-simples-back-black.svg'
        },
        dark: {
            expanded: '/assets/images/logo-back-black.svg',
            collapsed: '/assets/images/logo-simples-back-white.svg'
        }
    };

    // Função para obter o estado atual do tema (claro ou escuro)
    function getCurrentTheme() {
        return document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    }

    // Função para atualizar a logo com base no estado atual da sidebar e do tema
    function updateLogo() {
        const currentTheme = getCurrentTheme();
        const logoState = sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded';
        logoImage.src = logos[currentTheme][logoState];
    }

    // Alternar a classe 'collapsed' na sidebar ao clicar no botão
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');

        // Alternar o ícone do menu hambúrguer
        if (sidebar.classList.contains('collapsed')) {
            sidebarIcon.classList.remove('fa-bars');
            sidebarIcon.classList.add('fa-chevron-right');
        } else {
            sidebarIcon.classList.remove('fa-chevron-right');
            sidebarIcon.classList.add('fa-bars');
        }

        // Atualizar a logo
        updateLogo();
    });

    // Alternância de Tema e atualização da logo
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const currentTheme = getCurrentTheme();
        
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        // Atualizar a logo com base no novo tema
        updateLogo();
    });

    // Função para gerenciar dropdowns
    function setupDropdown(buttonId, menuSelector) {
        const button = document.getElementById(buttonId);
        const menu = document.querySelector(menuSelector);

        // Abrir/fechar dropdown ao clicar no botão
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            menu.classList.toggle('show');
        });

        // Impedir o fechamento do dropdown ao clicar dentro dele
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Função para fechar todos os dropdowns
    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu.show');
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    }

    // Fechar os dropdowns ao clicar fora deles
    window.addEventListener('click', () => {
        closeAllDropdowns();
    });

    // Configurar os dropdowns individualmente
    setupDropdown('filterDropdown', '#filterDropdown + .dropdown-menu');
    setupDropdown('profileDropdown', '#profileDropdown + .dropdown-menu');

    // Inicializar a logo com base no tema e estado da sidebar
    updateLogo();
});
