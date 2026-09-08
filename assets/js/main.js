/* ==========================================================================
   PROJECT: PyM - JAVASCRIPT CENTRAL (Menú e Interacciones)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------------------------------
    // 1. CONTROL DEL MENÚ FLOTANTE DESPLEGABLE
    // --------------------------------------------------------------------------
    const btnMenu = document.getElementById('btn-menu');
    const menuOpciones = document.getElementById('menu-opciones');
    const iconoMenu = document.querySelector('.icono-menu');
    const iconoCerrar = document.querySelector('.icono-cerrar');

    if (btnMenu && menuOpciones) {
        btnMenu.addEventListener('click', () => {
            const estaAbierto = menuOpciones.classList.toggle('menu-abierto');
            
            btnMenu.setAttribute('aria-expanded', estaAbierto);
            menuOpciones.setAttribute('aria-hidden', !estaAbierto);
            
            if (estaAbierto) {
                if (iconoMenu) iconoMenu.style.display = 'none';
                if (iconoCerrar) iconoCerrar.style.display = 'block';
            } else {
                if (iconoMenu) iconoMenu.style.display = 'block';
                if (iconoCerrar) iconoCerrar.style.display = 'none';
            }
        });

        // Cierra el menú al tocar cualquier otra parte de la pantalla
        document.addEventListener('click', (evento) => {
            if (!menuOpciones.contains(evento.target) && !btnMenu.contains(evento.target)) {
                menuOpciones.classList.remove('menu-abierto');
                btnMenu.setAttribute('aria-expanded', 'false');
                menuOpciones.setAttribute('aria-hidden', 'true');
                if (iconoMenu) iconoMenu.style.display = 'block';
                if (iconoCerrar) iconoCerrar.style.display = 'none';
            }
        });
    }

    // --------------------------------------------------------------------------
    // 2. CONTROL DE CONTADORES (Botones + y - del Catálogo)
    // --------------------------------------------------------------------------
    const tarjetas = document.querySelectorAll('.tarjeta-producto');

    tarjetas.forEach(tarjeta => {
        const btnRestar = tarjeta.querySelector('.btn-restar');
        const btnSumar = tarjeta.querySelector('.btn-sumar');
        const contador = tarjeta.querySelector('.cantidad-valor');

        if (btnSumar && btnRestar && contador) {
            btnSumar.addEventListener('click', () => {
                let cantidad = parseInt(contador.textContent) || 0;
                contador.textContent = cantidad + 1;
            });

            btnRestar.addEventListener('click', () => {
                let cantidad = parseInt(contador.textContent) || 0;
                if (cantidad > 0) {
                    contador.textContent = cantidad - 1;
                }
            });
        }
    });

    // --------------------------------------------------------------------------
    // 3. ARMADOR DE PEDIDOS Y ENVÍO REFORZADO A WHATSAPP
    // --------------------------------------------------------------------------
    const btnEnviar = document.getElementById('btn-enviar-whatsapp');
    
    if (btnEnviar) {
        btnEnviar.addEventListener('click', () => {
            let mensaje = "¡Hola PyM! 🍕 Quiero realizar el siguiente pedido:\n\n";
            let tieneProductos = false;
            let total = 0;

            tarjetas.forEach(tarjeta => {
                const nombre = tarjeta.getAttribute('data-nombre');
                const precio = parseFloat(tarjeta.getAttribute('data-precio'));
                const contador = tarjeta.querySelector('.cantidad-valor');
                
                if (contador) {
                    const cantidad = parseInt(contador.textContent) || 0;
                    if (cantidad > 0) {
                        tieneProductos = true;
                        let subtotal = precio * cantidad;
                        total += subtotal;
                        mensaje += `🔹 *${cantidad}x* ${nombre} ($${precio} c/u) -> *$${subtotal}*\n`;
                    }
                }
            });

            if (!tieneProductos) {
                alert("Por favor, selecciona al menos un producto para tu pedido. 🍕");
                return;
            }

            mensaje += `\n💰 *Total Estimado:* *$${total}*\n\nMuchas gracias. ¡Espero su confirmación!`;


            // Codificación segura y limpia para la URL
            const mensajeCodificado = encodeURIComponent(mensaje);
            
            // 🌟 CORRECCIÓN EXACTA: Agregamos tu número real y la barra correspondiente
            const urlFinal = 'https://wa.me/5491135746115?text=' + mensajeCodificado;
            
            // Abrimos de forma nativa
            window.open(urlFinal, '_blank');
        });
    }
});