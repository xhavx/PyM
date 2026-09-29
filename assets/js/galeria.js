document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.btn-pestana');
    const secciones = document.querySelectorAll('.galeria-productos-seccion');

    botones.forEach(boton => {
      boton.addEventListener('click', () => {
        const objetivo = boton.getAttribute('data-target');

        // Desactivar todos los botones
        botones.forEach(btn => {
          btn.classList.remove('activo');
          btn.setAttribute('aria-selected', 'false');
        });

        // Ocultar todas las secciones y pausar videos activos
        secciones.forEach(sec => {
          sec.style.display = 'none';
          sec.setAttribute('aria-hidden', 'true');
          
          // Si hay algún video reproduciéndose en la sección oculta, lo frena
          const videos = sec.querySelectorAll('video');
          videos.forEach(video => video.pause());
        });

        // Activar el botón seleccionado
        boton.classList.add('activo');
        boton.setAttribute('aria-selected', 'true');

        // Mostrar la sección correspondiente
        const seccionActiva = document.getElementById(objetivo);
        seccionActiva.style.display = 'block';
        seccionActiva.setAttribute('aria-hidden', 'false');
      });
    });
  });