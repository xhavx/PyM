// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.getElementById('btn-menu');
    const menuOpciones = document.getElementById('menu-opciones');
    const iconoMenu = document.querySelector('.icono-menu');
    const iconoCerrar = document.querySelector('.icono-cerrar');

    if (btnMenu && menuOpciones) {
        btnMenu.addEventListener('click', () => {
            // 1. Alterna la clase para abrir/cerrar el menú animado con clip-path
            const estaAbierto = menuOpciones.classList.toggle('menu-abierto');
            
            // 2. Control de accesibilidad ARIA
            btnMenu.setAttribute('aria-expanded', estaAbierto);
            menuOpciones.setAttribute('aria-hidden', !estaAbierto);
            
            // 3. Intercambia el ícono de las tres rayitas por la equis (X)
            if (estaAbierto) {
                iconoMenu.style.display = 'none';
                iconoCerrar.style.display = 'block';
            } else {
                iconoMenu.style.display = 'block';
                iconoCerrar.style.display = 'none';
            }
        });

        // Cierra el menú automáticamente si el usuario toca en cualquier otra parte de la pantalla
        document.addEventListener('click', (evento) => {
            if (!menuOpciones.contains(evento.target) && !btnMenu.contains(evento.target)) {
                menuOpciones.classList.remove('menu-abierto');
                btnMenu.setAttribute('aria-expanded', 'false');
                menuOpciones.setAttribute('aria-hidden', 'true');
                iconoMenu.style.display = 'block';
                iconoCerrar.style.display = 'none';
            }
        });
    }
});