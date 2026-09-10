/* ==========================================================================
   PROJECT: PyM - JAVASCRIPT CENTRAL (Menú e Interacciones)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------------------------------
    // 1. CONTROL DEL MENÚ FLOTANTE DESPLEGABLE (Se mantiene idéntico)
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
    // FUNCIÓN AUXILIAR: Para mostrar las fracciones de peso de forma amigable
    // --------------------------------------------------------------------------
    function formatearTextoPeso(valor) {
        if (valor === 0) return "0 kg";
        if (valor === 0.25) return "1/4 kg";
        if (valor === 0.5) return "1/2 kg";
        if (valor === 0.75) return "3/4 kg";
        
        // Si es un número entero (ej: 1, 2) devolvemos "X kg"
        if (Number.isInteger(valor)) return `${valor} kg`;
        
        // Si es un número decimal (ej: 1.25) lo dejamos con la unidad
        return `${valor} kg`;
    }

    // --------------------------------------------------------------------------
    // FUNCIÓN AUXILIAR: Extrae el valor numérico actual del texto del contador
    // --------------------------------------------------------------------------
    function obtenerCantidadNumerica(texto, esPeso) {
        if (!esPeso) {
            return parseInt(texto) || 0;
        }
        // Si es peso, quitamos la palabra "kg" y los textos de fracción comunes
        let limpio = texto.replace(' kg', '').trim();
        if (limpio === "1/4") return 0.25;
        if (limpio === "1/2") return 0.5;
        if (limpio === "3/4") return 0.75;
        return parseFloat(limpio) || 0;
    }

// --------------------------------------------------------------------------
    // FUNCIÓN PARA MOSTRAR EL CARTELITO (TOAST)
    // --------------------------------------------------------------------------
    const toast = document.getElementById('toast-alerta');
    let toastTimeout; // Evita que se superpongan los tiempos si cliquean rápido

    function mostrarToast(nombreProducto) {
        if (!toast) return;

        // Cambiamos el texto dinámicamente para que sea más personalizado
        const textoToast = toast.querySelector('.toast-texto');
        if (textoToast) {
            textoToast.innerHTML = `¡<strong>${nombreProducto}</strong> agregado al pedido!`;
        }

        // Si ya se estaba mostrando, cancelamos el cierre anterior
        clearTimeout(toastTimeout);

        // Agregamos la clase para que aparezca en pantalla
        toast.classList.add('toast-visible');

        // Lo ocultamos automáticamente después de 2.5 segundos
        toastTimeout = setTimeout(() => {
            toast.classList.remove('toast-visible');
        }, 2500);
    }

    // --------------------------------------------------------------------------
    // 2. CONTROL DE CONTADORES (Botones + y - del Catálogo Adaptados)
    // --------------------------------------------------------------------------
    const tarjetas = document.querySelectorAll('.tarjeta-producto');

    tarjetas.forEach(tarjeta => {
        const btnRestar = tarjeta.querySelector('.btn-restar');
        const btnSumar = tarjeta.querySelector('.btn-sumar');
        const contador = tarjeta.querySelector('.cantidad-valor');
        
        const esProductoPeso = tarjeta.getAttribute('data-unidad') === 'peso';
        const paso = esProductoPeso ? 0.25 : 1;

        if (btnSumar && btnRestar && contador) {
            
            // Botón Más (+)
            btnSumar.addEventListener('click', () => {
                let cantidadActual = obtenerCantidadNumerica(contador.textContent, esProductoPeso);
                let nuevaCantidad = cantidadActual + paso;
                
                if (esProductoPeso) {
                    contador.textContent = formatearTextoPeso(nuevaCantidad);
                } else {
                    contador.textContent = nuevaCantidad;
                }

                // 🌟 ¡AQUÍ ACTIVAMOS EL CARTELITO! 
                const nombre = tarjeta.getAttribute('data-nombre');
                mostrarToast(nombre);
            });

            // Botón Menos (-)
            btnRestar.addEventListener('click', () => {
                let cantidadActual = obtenerCantidadNumerica(contador.textContent, esProductoPeso);
                
                if (cantidadActual > 0) {
                    let nuevaCantidad = cantidadActual - paso;
                    nuevaCantidad = Math.round(nuevaCantidad * 100) / 100;

                    if (esProductoPeso) {
                        contador.textContent = formatearTextoPeso(nuevaCantidad);
                    } else {
                        contador.textContent = nuevaCantidad;
                    }
                }
            });
        }
    });

// --------------------------------------------------------------------------
    // 3. ARMADOR DE PEDIDOS, SELECTOR DE ENTREGA Y ENVÍO A WHATSAPP
    // --------------------------------------------------------------------------
    const btnEnviar = document.getElementById('btn-enviar-whatsapp');
    const selectorEntrega = document.getElementById('selector-entrega');
    const contenedorDireccion = document.getElementById('contenedor-direccion');
    const inputDireccion = document.getElementById('input-direccion');
    const notaDistancia = document.getElementById('nota-distancia'); // Capturamos la nota

    const COSTO_DELIVERY = 500; // Cambiá acá el costo de tu envío

    if (selectorEntrega && contenedorDireccion) {
        selectorEntrega.addEventListener('change', () => {
            if (selectorEntrega.value === 'delivery') {
                contenedorDireccion.style.display = 'block';
                if (notaDistancia) notaDistancia.style.display = 'block'; // Mostramos la advertencia de 3km
                inputDireccion.focus();
            } else {
                contenedorDireccion.style.display = 'none';
                if (notaDistancia) notaDistancia.style.display = 'none'; // Ocultamos la advertencia
                inputDireccion.value = '';
            }
        });
    }
    
    if (btnEnviar) {
        btnEnviar.addEventListener('click', () => {
            let mensaje = "*¡Hola PyM! Quiero realizar el siguiente pedido:*\n\n";
            let tieneProductos = false;
            let totalProductos = 0;

            tarjetas.forEach(tarjeta => {
                const nombre = tarjeta.getAttribute('data-nombre');
                const precio = parseFloat(tarjeta.getAttribute('data-precio'));
                const contador = tarjeta.querySelector('.cantidad-valor');
                const esProductoPeso = tarjeta.getAttribute('data-unidad') === 'peso';
                
                if (contador) {
                    const cantidad = obtenerCantidadNumerica(contador.textContent, esProductoPeso);
                    
                    if (cantidad > 0) {
                        tieneProductos = true;
                        let subtotal = precio * cantidad;
                        totalProductos += subtotal;
                        
                        if (esProductoPeso) {
                            const textoPeso = formatearTextoPeso(cantidad);
                            mensaje += `• *${textoPeso}* de ${nombre} ($${precio} x kg) -> *$${subtotal.toFixed(0)}*\n`;
                        } else {
                            mensaje += `• *${cantidad}x* ${nombre} ($${precio} c/u) -> *$${subtotal.toFixed(0)}*\n`;
                        }
                    }
                }
            });

            if (!tieneProductos) {
                alert("Por favor, selecciona al menos un producto para tu pedido.");
                return;
            }

            const tipoEntrega = selectorEntrega ? selectorEntrega.value : 'retiro';
            let totalFinal = totalProductos;
            let detallesEntrega = "";

            if (tipoEntrega === 'delivery') {
                const direccion = inputDireccion.value.trim();
                if (direccion === "") {
                    alert("Por favor, ingresá tu dirección para el envío a domicilio.");
                    inputDireccion.focus();
                    return;
                }
                totalFinal += COSTO_DELIVERY;
                // Agregamos una nota en el mensaje recordando el límite de distancia
                 detallesEntrega = `\n- *Modo:* Envío a domicilio\n- *Dirección:* ${direccion}\n- *Costo de envío:* $${COSTO_DELIVERY}\n- _(Sujeto a radio máximo de 3 km)_`;
            } else {
                detallesEntrega = `\n- *Modo:* Retiro por el local\n- _(Revisé los días y horarios al final de la página)_`;
            }

            mensaje += `\n*Subtotal Productos:* *$${totalProductos.toFixed(0)}*`;
            mensaje += detallesEntrega;
            mensaje += `\n\n*Total Estimado:* *$${totalFinal.toFixed(0)}*`;
            mensaje += `\n\nMuchas gracias. ¡Espero su confirmación!`;

            const mensajeCodificado = encodeURIComponent(mensaje);
            const urlFinal = 'https://wa.me/5491135746115?text=' + mensajeCodificado;
            
            window.open(urlFinal, '_blank');
        });
    }
});
            