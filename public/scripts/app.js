// Elementos del DOM
const botonCargarYoutube = document.getElementById('boton-cargar-youtube');
const reproductorAudio = document.getElementById('reproductor-audio');
const lienzo = document.getElementById('lienzo-animacion');
const contexto = lienzo.getContext('2d');
const botonPlay = document.getElementById('boton-play');
const botonPausa = document.getElementById('boton-pausa');
const botonStop = document.getElementById('boton-stop');
const botonMenu = document.getElementById('boton-menu');
const menuHistorial = document.getElementById('menu-historial');
const listaCanciones = document.getElementById('lista-canciones');
const textoNombreActual = document.getElementById('nombre-actual');
const botonSelector = document.getElementById('boton-selector');
const menuAnimaciones = document.getElementById('menu-animaciones');
const inputArchivo = document.getElementById('input-archivo');
const botonCargarArchivo = document.getElementById('boton-cargar-archivo');
const botonDemo = document.getElementById('boton-demo');
const menuDemos = document.getElementById('menu-demos');
const inputYoutube = document.getElementById('input-youtube');
const displayNombreArchivo = document.getElementById('display-nombre-archivo');
const btnFullscreen = document.getElementById('btn-fullscreen');
const botonSettings = document.getElementById('boton-settings');
const menuSettings = document.getElementById('menu-settings');
const barraReproduccion = document.getElementById('barra-reproduccion');
const progreso = document.getElementById('progreso-audio');
const tiempoActual = document.getElementById('tiempo-actual');
const tiempoTotal = document.getElementById('tiempo-total');
const contenedorProgreso = document.querySelector('.contenedor-progreso');
const contenedorCanvas = document.querySelector('.contenedor-canvas-barra');
const botonSelectorPaleta = document.getElementById('boton-selector-paleta');
const menuPaletas = document.getElementById('menu-paletas');

// Variables para audio y visualización
let contextoAudio = null;
let analizador = null;
let fuenteAudio = null;
let datosAudio = null;
let animacionActiva = null;
let tipoAnimacion = 'onda';
let paletaActual = 'neon'; // Paleta por defecto
let nombreCancionActual = '';
let historialCanciones = [];
let archivoCargado = false; // true cuando se carga un archivo

// Definición de paletas de colores
// Organizadas de BAJOS (graves/intensos) a AGUDOS (brillantes/claros)
const paletas = {
    neon: {
        nombre: 'Neón',
        // Bajos: rojo/magenta → Medios: naranja/amarillo → Agudos: verde/cyan brillante
        colores: ['#ff00ff', '#ff0099', '#ff3366', '#ff6600', '#ffaa00', '#ffff00', '#00ff00', '#00ffff']
    },
    calida: {
        nombre: 'Cálida',
        // Bajos: rojo oscuro → Medios: naranja/coral → Agudos: amarillo claro/verde claro
        colores: ['#8b0000', '#d32f2f', '#ff5722', '#ff8a65', '#ffb74d', '#ffd54f', '#fff59d', '#f0f4c3']
    },
    fria: {
        nombre: 'Fría',
        // Bajos: morado oscuro → Medios: azul/violeta → Agudos: cyan/aqua claro
        colores: ['#4a148c', '#7b1fa2', '#9c27b0', '#ba68c8', '#7986cb', '#64b5f6', '#4dd0e1', '#b2ebf2']
    }
};

// Función para obtener color de la paleta actual según índice
function obtenerColorPaleta(indice, total) {
    const coloresPaleta = paletas[paletaActual].colores;
    const indicePaleta = Math.floor((indice / total) * coloresPaleta.length) % coloresPaleta.length;
    return coloresPaleta[indicePaleta];
}

// Función para obtener color HSL dinámico basado en paleta
function obtenerColorHSL(valor, indice, total) {
    const coloresPaleta = paletas[paletaActual].colores;
    const color = coloresPaleta[Math.floor((indice / total) * coloresPaleta.length) % coloresPaleta.length];
    return color;
}

// Función para verificar y habilitar el botón Play
function verificarYHabilitarPlay() {
    // Habilitar Play solo si hay archivo cargado, tipo de animación y paleta seleccionada
    if (archivoCargado && tipoAnimacion && tipoAnimacion !== '' && paletaActual) {
        botonPlay.disabled = false;
        botonStop.disabled = false;
        console.log('✅ Visualizador listo: archivo cargado, animación y paleta seleccionadas');
    } else {
        botonPlay.disabled = true;
        console.log('⏳ Esperando:', {
            archivoCargado,
            tipoAnimacion: tipoAnimacion || 'no seleccionado',
            paletaActual
        });
    }
}

// Ajustar canvas para pantallas HiDPI y responsivo
function ajustarCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const cssWidth = lienzo.clientWidth;
    const cssHeight = lienzo.clientHeight;
    lienzo.width = Math.floor(cssWidth * ratio);
    lienzo.height = Math.floor(cssHeight * ratio);
    contexto.setTransform(ratio, 0, 0, ratio, 0, 0); // dibujar en coordenadas CSS
}
ajustarCanvas();
window.addEventListener('resize', () => {
    ajustarCanvas();
    limpiarLienzo();
});

// Cargar demo aleatorio si viene desde index.html
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'random') {
        // Arrays de opciones
        const audios = ['Instrumental Corto.wav', 'Metal.mp3', 'Nota pura.wav', 'Pop.mp3', 'Reggae.mp3', 'Rock.mp3', 'Salsa.mp3', 'Techno.mp3'];
        const animaciones = ['onda', 'barras', 'estrellas', 'puntos', 'curvas'];
        const textosAnimacion = {
            'onda': 'Onda',
            'barras': 'Barras',
            'estrellas': 'Estrellas',
            'puntos': 'Puntos',
            'curvas': 'Curvas'
        };
        const paletasDisponibles = ['neon', 'calida', 'fria'];
        const textosPaleta = {
            'neon': 'Neón',
            'calida': 'Cálida',
            'fria': 'Fría'
        };

        // Selección aleatoria
        const audioAleatorio = audios[Math.floor(Math.random() * audios.length)];
        const animacionAleatoria = animaciones[Math.floor(Math.random() * animaciones.length)];
        const paletaAleatoria = paletasDisponibles[Math.floor(Math.random() * paletasDisponibles.length)];

        // Cargar el audio
        const rutaArchivo = 'public/assets/audios demo/' + audioAleatorio;
        reproductorAudio.src = rutaArchivo;
        
        // Configurar animación
        tipoAnimacion = animacionAleatoria;
        botonSelector.textContent = textosAnimacion[animacionAleatoria];
        
        // Configurar paleta
        paletaActual = paletaAleatoria;
        botonSelectorPaleta.textContent = textosPaleta[paletaAleatoria];
        
        // Actualizar UI
        displayNombreArchivo.value = audioAleatorio;
        nombreCancionActual = audioAleatorio;
        archivoCargado = true;
        textoNombreActual.textContent = audioAleatorio;
        
        // Agregar al historial
        agregarAlHistorial(audioAleatorio, animacionAleatoria);
        
        // Configurar Web Audio API para que esté listo
        reproductorAudio.addEventListener('loadeddata', () => {
            configurarAudio().then(() => {
                console.log('✅ Web Audio API inicializado para demo');
            }).catch(err => {
                console.warn('Error al inicializar audio:', err);
            });
        }, { once: true });
        
        // Habilitar controles
        botonPlay.disabled = false;
        botonPausa.disabled = true;
        botonStop.disabled = false;

        console.log(`Demo cargado: ${audioAleatorio} con visualización ${animacionAleatoria} y paleta ${textosPaleta[paletaAleatoria]}`);
    }
});

// Menu historial
botonMenu.addEventListener('click', () => {
    menuHistorial.classList.toggle('abierto');
});

// Botón para limpiar historial
const botonLimpiarHistorial = document.getElementById('boton-limpiar-historial');
botonLimpiarHistorial.addEventListener('click', () => {
    // Limpiar el array de historial
    historialCanciones = [];
    // Limpiar todos los elementos del DOM
    listaCanciones.innerHTML = '';
    console.log('Historial limpiado');
});

// Inicializar estado de botones
botonPlay.disabled = true;
botonPausa.disabled = true;
botonStop.disabled = true;

// Selector de animaciones
botonSelector.addEventListener('click', () => {
    // Move dropdown to body and position fixed so it overlays everything
    if (menuAnimaciones.parentElement !== document.body) {
        document.body.appendChild(menuAnimaciones);
    }

    const rect = botonSelector.getBoundingClientRect();
    // Position the menu right below the selector
    menuAnimaciones.style.position = 'fixed';
    menuAnimaciones.style.left = rect.left + 'px';
    menuAnimaciones.style.top = (rect.bottom + 8) + 'px';
    menuAnimaciones.style.width = 'auto';
    menuAnimaciones.style.minWidth = '200px';
    menuAnimaciones.style.maxWidth = '300px';
    menuAnimaciones.style.zIndex = '4000';

    const mostrar = menuAnimaciones.classList.toggle('mostrar');
    menuAnimaciones.setAttribute('aria-hidden', (!mostrar).toString());
});

// Selector de paletas de colores
botonSelectorPaleta.addEventListener('click', () => {
    if (menuPaletas.parentElement !== document.body) {
        document.body.appendChild(menuPaletas);
    }

    const rect = botonSelectorPaleta.getBoundingClientRect();
    menuPaletas.style.position = 'fixed';
    menuPaletas.style.left = rect.left + 'px';
    menuPaletas.style.top = (rect.bottom + 8) + 'px';
    menuPaletas.style.width = 'auto';
    menuPaletas.style.minWidth = '200px';
    menuPaletas.style.maxWidth = '300px';
    menuPaletas.style.maxWidth = 'calc(100% - 32px)';
    menuPaletas.style.zIndex = '4000';

    const mostrar = menuPaletas.classList.toggle('mostrar');
    menuPaletas.setAttribute('aria-hidden', (!mostrar).toString());
});

// Opciones de paleta de colores
const opcionesPaleta = document.querySelectorAll('.opcion-paleta');
opcionesPaleta.forEach(opcion => {
    opcion.addEventListener('click', function() {
        const paletaNueva = this.dataset.paleta;
        paletaActual = paletaNueva;
        botonSelectorPaleta.innerHTML = `Paleta seleccionada: <strong>${paletas[paletaNueva].nombre}</strong>`;
        botonSelectorPaleta.style.color = '#5be6d6';
        menuPaletas.classList.remove('mostrar');
        menuPaletas.setAttribute('aria-hidden', 'true');
        console.log('Paleta de colores seleccionada:', paletas[paletaNueva].nombre);
        
        // Verificar si se puede habilitar el Play
        verificarYHabilitarPlay();
    });
});

// Opciones de animacion
const opcionesAnimacion = document.querySelectorAll('.opcion-animacion');
opcionesAnimacion.forEach(opcion => {
    opcion.addEventListener('click', function() {
        const tipoNuevo = this.dataset.tipo || 'onda';
        botonSelector.textContent = this.textContent;
        menuAnimaciones.classList.remove('mostrar');
        menuAnimaciones.setAttribute('aria-hidden', 'true');

        // Si hay un archivo cargado, registrar en historial cada vez que cambie el tipo
        if (archivoCargado && nombreCancionActual) {
            // Agregar entrada sólo si no es idéntica a la última
            const ultima = historialCanciones[historialCanciones.length - 1];
            if (!ultima || ultima.nombre !== nombreCancionActual || ultima.tipo !== tipoNuevo) {
                agregarAlHistorial(nombreCancionActual, tipoNuevo);
            }
        }

        tipoAnimacion = tipoNuevo;
        
        // Verificar si se puede habilitar el botón Play
        verificarYHabilitarPlay();
        
        // Verificar si se puede habilitar el botón de descarga
        habilitarBotonDescarga();
    });
});

// Placeholder behavior removed — menu shows only the defined animation options.

// Botón para abrir diálogo de archivo (apoya usabilidad)
botonCargarArchivo.addEventListener('click', () => inputArchivo.click());


// Cargar audio desde YouTube 
botonCargarYoutube.addEventListener("click", async () => {
    const url = inputYoutube.value.trim();
    if (!url) {
        alert("Por favor, pega un enlace de YouTube.");
        return;
    }

    // Detectar si estamos en producción o local
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3001' 
        : window.location.origin;

    // Mostrar indicador de carga
    displayNombreArchivo.value = "Cargando...";
    botonCargarYoutube.disabled = true;
    botonCargarYoutube.textContent = "Cargando...";

    // Limpia estados previos
    try {
        reproductorAudio.pause();
    } catch (e) {}
    reproductorAudio.currentTime = 0;
    detenerAnimacion();
    limpiarLienzo();

    try {
        // Obtener información del video primero
        const infoResp = await fetch(`${API_URL}/youtube/info?url=` + encodeURIComponent(url));
        
        // Leer respuesta como JSON incluso si hay error
        const responseData = await infoResp.json();
        
        if (!infoResp.ok) {
            // El servidor devolvió un error, usar el mensaje específico
            throw new Error(responseData.error || 'Error del servidor');
        }

        const videoInfo = responseData;
        const titulo = videoInfo.title || "YouTube Audio";

        // Mostrar el título en el campo de nombre de archivo
        displayNombreArchivo.value = titulo;
        nombreCancionActual = titulo;
        textoNombreActual.textContent = titulo;

        // Usar endpoint de streaming directo
        const streamEndpoint = `${API_URL}/youtube/stream?url=` + encodeURIComponent(url);
        
        console.log('🎵 Configurando audio con streaming del servidor...');
        
        // Configurar reproductor de audio
        reproductorAudio.crossOrigin = 'anonymous';
        reproductorAudio.src = streamEndpoint;
        
        // Marcar como cargado (el stream se cargará cuando se reproduzca)
        archivoCargado = true;

        // Conectar WebAudio cuando esté listo
        reproductorAudio.addEventListener('loadedmetadata', () => {
            console.log('✅ Metadatos cargados, inicializando Web Audio API...');
            configurarAudio().then(() => {
                console.log('✅ Web Audio API configurado');
            }).catch(err => {
                console.error('❌ Error configurando Web Audio:', err);
            });
        }, { once: true });

        // Agregar al historial
        agregarAlHistorial(titulo, tipoAnimacion || "En espera");

        // Verificar y habilitar botones según configuración actual
        verificarYHabilitarPlay();
        botonPausa.disabled = true;

        // Restaurar botón de carga
        botonCargarYoutube.disabled = false;
        botonCargarYoutube.textContent = "Cargar";

        console.log('✅ Video de YouTube configurado:', titulo);

    } catch (e) {
        console.error('❌ Error cargando audio de YouTube:', e);
        displayNombreArchivo.value = "No hay archivo seleccionado";
        
        // Mensaje más específico según el error
        let mensaje = "No se pudo cargar el video de YouTube.\n\n";
        
        if (e.message && (e.message.includes('429') || e.message.includes('temporalmente'))) {
            mensaje += "⚠️ YouTube está bloqueando las peticiones desde este servidor.\n\n";
            mensaje += "💡 Soluciones:\n";
            mensaje += "1. Usa los 8 demos incluidos (botón 'Probar con un demo')\n";
            mensaje += "2. Carga un archivo MP3/WAV de tu computadora\n";
            mensaje += "3. YouTube funciona en la versión local del proyecto";
        } else {
            mensaje += "Motivo: " + e.message + "\n\n";
            mensaje += "💡 Alternativas:\n";
            mensaje += "• Verifica que el enlace sea válido\n";
            mensaje += "• El video no esté restringido por región\n";
            mensaje += "• Usa los demos o archivos locales";
        }
        
        alert(mensaje);
        
        // Restaurar botón de carga
        botonCargarYoutube.disabled = false;
        botonCargarYoutube.textContent = "Cargar";
    }
});





// Botón para mostrar menú de demos
botonDemo.addEventListener('click', () => {
    const mostrar = menuDemos.classList.toggle('mostrar');
    menuDemos.setAttribute('aria-hidden', (!mostrar).toString());
});

// Opciones de demos
const opcionesDemos = document.querySelectorAll('.opcion-demo');
opcionesDemos.forEach(opcion => {
    opcion.addEventListener('click', function() {
        const nombreArchivo = this.getAttribute('data-archivo');
        const rutaArchivo = 'public/assets/' + nombreArchivo;
        
        // Si ya había un audio cargado, detenerlo
        if (reproductorAudio.src) {
            try {
                reproductorAudio.pause();
            } catch (e) {}
            reproductorAudio.currentTime = 0;
            detenerAnimacion();
            limpiarLienzo();
        }
        
        // Cargar el archivo de demo
        reproductorAudio.src = rutaArchivo;
        nombreCancionActual = nombreArchivo;
        textoNombreActual.textContent = nombreArchivo;
        displayNombreArchivo.value = nombreArchivo;
        archivoCargado = true;
        habilitarBotonDescarga();
        
        // Actualizar historial
        agregarAlHistorial(nombreArchivo, tipoAnimacion);
        
        // Habilitar botones de control
        botonPlay.disabled = false;
        botonPausa.disabled = true;
        botonStop.disabled = false;
        
        // Cerrar menú
        menuDemos.classList.remove('mostrar');
        menuDemos.setAttribute('aria-hidden', 'true');
    });
});

// Cuando seleccionan archivo
inputArchivo.addEventListener('change', function(evento) {
    const archivo = evento.target.files && evento.target.files[0];
    if (!archivo) return;

    // Si ya había un audio cargado, detenerlo y limpiar estado para evitar sobreescrituras
    if (reproductorAudio.src) {
        try {
            reproductorAudio.pause();
        } catch (e) {}
        reproductorAudio.currentTime = 0;
        detenerAnimacion();
        limpiarLienzo();
    }

    const urlArchivo = URL.createObjectURL(archivo);
    reproductorAudio.src = urlArchivo;
    nombreCancionActual = archivo.name;
    textoNombreActual.textContent = nombreCancionActual;
    // Mostrar nombre en la barra visible
    if (displayNombreArchivo) displayNombreArchivo.value = nombreCancionActual;

    // Marcar que hay un archivo cargado pero NO reproducir automáticamente
    archivoCargado = true;
    habilitarBotonDescarga();

    // Mantener Play deshabilitado hasta que el usuario seleccione un tipo de visualización
    botonPlay.disabled = true;
    botonPausa.disabled = true;
    botonStop.disabled = true;

    // Resetear selector de animación para este nuevo archivo
    if (botonSelector) {
        botonSelector.textContent = 'Seleccione un tipo de animación.';
    }
    // Resetear tipo de animación interno para evitar reutilizar la anterior
    tipoAnimacion = '';
    // Cerrar menú de animaciones si estuviera abierto
    if (menuAnimaciones) {
        menuAnimaciones.classList.remove('mostrar');
        menuAnimaciones.setAttribute('aria-hidden', 'true');
    }

    // Preparar audio (conectar AudioContext) pero no forzar reproducción
    configurarAudio().catch(err => {
        console.error('Error al configurar audio:', err);
    });
});

// Agregar al historial visual
function agregarAlHistorial(nombreCancion, tipo) {
    // Asegurarse de que el último elemento no sea idéntico (misma canción y mismo tipo)
    const ultimo = historialCanciones[historialCanciones.length - 1];
    if (ultimo && ultimo.nombre === nombreCancion && ultimo.tipo === tipo) {
        return; // duplicado consecutivo
    }

    const cancion = { nombre: nombreCancion, tipo: tipo };
    historialCanciones.push(cancion);
    console.log('Historial:', historialCanciones);

    const item = document.createElement('div');
    item.className = 'item-cancion';
    item.innerHTML = `<p><strong>${escapeHtml(nombreCancion)}</strong></p><p>Tipo: ${escapeHtml(tipo)}</p>`;
    listaCanciones.prepend(item);
}



// escape simple para evitar insertar HTML desde nombres
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

// Configurar Web Audio API (devuelve Promise para asegurar resume)
function configurarAudio() {
    return new Promise((resolve, reject) => {
        try {
            if (!contextoAudio) {
                contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Evitar crear *otra* MediaElementSource para el mismo elemento
            // Si ya existe una fuente, desconectar sus conexiones y reutilizarla
            if (!fuenteAudio) {
                fuenteAudio = contextoAudio.createMediaElementSource(reproductorAudio);
            } else {
                try { fuenteAudio.disconnect(); } catch (e) { /* ignore */ }
            }

            // Desconectar y recrear el analizador para evitar conexiones obsoletas
            if (analizador) {
                try { analizador.disconnect(); } catch (e) { /* ignore */ }
            }
            analizador = contextoAudio.createAnalyser();
            analizador.fftSize = 2048;
            datosAudio = new Uint8Array(analizador.frequencyBinCount);

            // Conectar: fuente -> analizador -> destino
            try {
                fuenteAudio.connect(analizador);
                analizador.connect(contextoAudio.destination);
            } catch (e) {
                // En casos raros la reconexión puede fallar; reportar pero no bloquear
                console.warn('Error al conectar fuente/analizador:', e);
            }

            // Algunas políticas requieren resume con interacción del usuario
            if (contextoAudio.state === 'suspended') {
                contextoAudio.resume().then(resolve).catch(resolve); // no bloquear si falla
            } else {
                resolve();
            }
        } catch (err) {
            reject(err);
        }
    });
}

// Reproducir con control de estado y manejo de botones
function reproducirAudio() {
    return new Promise((resolve, reject) => {
        if (!reproductorAudio.src) {
            alert('Por favor carga una canción primero');
            return reject(new Error('No hay src'));
        }

        // resume el contexto si está suspendido (por autoplay)
        if (contextoAudio && contextoAudio.state === 'suspended') {
            contextoAudio.resume().catch(()=>{});
        }

        reproductorAudio.play()
            .then(() => {
                botonPlay.disabled = true;
                botonPausa.disabled = false;
                botonStop.disabled = false;
                iniciarAnimacion();
                resolve();
            })
            .catch(err => {
                // puede fallar por políticas de autoplay
                console.warn('play() rejected', err);
                botonPlay.disabled = false;
                botonPausa.disabled = true;
                botonStop.disabled = true;
                reject(err);
            });
    });
}

// Controles Play / Pausa / Stop
botonPlay.addEventListener('click', () => {
    if (!reproductorAudio.src) {
        alert('Carga una canción primero.');
        return;
    }
    configurarAudio().then(reproducirAudio).catch(()=>{/no bloquear/});
});

botonPausa.addEventListener('click', () => {
    reproductorAudio.pause();
    detenerAnimacion();
    botonPlay.disabled = false;
    botonPausa.disabled = true;
});

botonStop.addEventListener('click', () => {
    reproductorAudio.pause();
    reproductorAudio.currentTime = 0;
    detenerAnimacion();
    limpiarLienzo();
    botonPlay.disabled = false;
    botonPausa.disabled = true;
});

// Cuando el audio termina, parar animación
reproductorAudio.addEventListener('ended', () => {
    detenerAnimacion();
    limpiarLienzo();
    botonPlay.disabled = false;
    botonPausa.disabled = true;
});

// iniciar/detener animación
function iniciarAnimacion() {
    if (!analizador || !datosAudio) return;
    if (animacionActiva) cancelAnimationFrame(animacionActiva);
    dibujarAnimacion();
}

function detenerAnimacion() {
    if (animacionActiva) {
        cancelAnimationFrame(animacionActiva);
        animacionActiva = null;
    }
}

function limpiarLienzo() {
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);
}

// bucle principal de dibujo
function dibujarAnimacion() {
    animacionActiva = requestAnimationFrame(dibujarAnimacion);
    if (!analizador || !datosAudio) return;

    analizador.getByteFrequencyData(datosAudio);

    // Fondo semitransparente para efecto "trail"
    contexto.fillStyle = 'rgba(15, 23, 42, 0.2)';
    contexto.fillRect(0, 0, lienzo.width, lienzo.height);

    // Selección de animación
    if (tipoAnimacion === 'onda') {
        dibujarOnda();
    } else if (tipoAnimacion === 'barras') {
        dibujarBarras();
    } else if (tipoAnimacion === 'estrellas') {
        dibujarEstrellas();
    } else if (tipoAnimacion === 'puntos') {
        dibujarPuntos();
    } else if (tipoAnimacion === 'curvas') {
        dibujarCurvas();
    }
}

/* ----- FUNCIONES DE DIBUJO ----- */
function dibujarOnda() {
    const cantidadDatos = datosAudio.length;
   
    const anchoSegmento = lienzo.width / cantidadDatos;
    const coloresPaleta = paletas[paletaActual].colores;

    for (let lado = 0; lado < 2; lado++) {
        contexto.beginPath();
        contexto.lineWidth = 3;
        // Usar primer y último color de la paleta para los dos lados
        contexto.strokeStyle = lado === 0 ? coloresPaleta[0] : coloresPaleta[coloresPaleta.length - 1];

        let x = lado === 0 ? 0 : lienzo.width;
        const direccion = lado === 0 ? 1 : -1;

        for (let i = 0; i < cantidadDatos; i++) {
            const v = datosAudio[i] / 255;
            const y = lienzo.height / 2 + Math.sin(i * 0.04 + Date.now() * 0.001) * v * 120;

            if (i === 0) contexto.moveTo(x, y);
            else contexto.lineTo(x, y);

            x += anchoSegmento * direccion;
        }
        contexto.stroke();
    }
}

function dibujarBarras() {
    const cantidadBarras = 64;
    const anchoBarras = lienzo.width / cantidadBarras;

    for (let i = 0; i < cantidadBarras; i++) {
        const muestra = Math.floor(i * (datosAudio.length / cantidadBarras));
        const alturaBarras = (datosAudio[muestra] / 255) * lienzo.height * 0.8;

        contexto.fillStyle = obtenerColorPaleta(i, cantidadBarras);
        contexto.fillRect(
            i * anchoBarras,
            lienzo.height - alturaBarras,
            Math.max(1, anchoBarras - 2),
            alturaBarras
        );
    }
}

function dibujarEstrellas() {
    const cantidadEstrellas = 50;
    const centroX = lienzo.width / 2;
    const centroY = lienzo.height / 2;

    for (let i = 0; i < cantidadEstrellas; i++) {
        const angulo = (i / cantidadEstrellas) * Math.PI * 2;
        const muestra = Math.floor((i * 4) % datosAudio.length);
        const magnitud = (datosAudio[muestra] / 255) * 200 + 30;

        const x = centroX + Math.cos(angulo) * magnitud;
        const y = centroY + Math.sin(angulo) * magnitud;

        const tamano = (datosAudio[muestra] / 255) * 6 + 1.5;

        contexto.beginPath();
        contexto.arc(x, y, tamano, 0, Math.PI * 2);
        contexto.fillStyle = obtenerColorPaleta(i, cantidadEstrellas);
        contexto.fill();
    }
}

function dibujarPuntos() {
    const columnas = 20;
    const filas = 15;
    const espaciadoX = lienzo.width / columnas;
    const espaciadoY = lienzo.height / filas;
    const totalPuntos = columnas * filas;

    for (let i = 0; i < columnas; i++) {
        for (let j = 0; j < filas; j++) {
            const indice = (i + j * columnas) % datosAudio.length;
            const tamano = (datosAudio[indice] / 255) * 15 + 1;

            const x = i * espaciadoX + espaciadoX / 2;
            const y = j * espaciadoY + espaciadoY / 2;

            contexto.beginPath();
            contexto.arc(x, y, tamano, 0, Math.PI * 2);
            const indicePunto = i + j * columnas;
            contexto.fillStyle = obtenerColorPaleta(indicePunto, totalPuntos);
            contexto.fill();
        }
    }
}

function dibujarCurvas() {
    const centroX = lienzo.width / 2;
    const centroY = lienzo.height / 2;
    const tiempo = Date.now() * 0.001;
    const coloresPaleta = paletas[paletaActual].colores;

    for (let k = 0; k < 3; k++) {
        contexto.beginPath();
        contexto.lineWidth = 2;
        // Usar colores de la paleta distribuidos
        contexto.strokeStyle = coloresPaleta[Math.floor((k / 3) * coloresPaleta.length)];

        for (let ang = 0; ang < Math.PI * 2 + 0.001; ang += 0.06) {
            const indice = Math.floor((ang / (Math.PI * 2)) * datosAudio.length) % datosAudio.length;
            const radio = 80 + (datosAudio[indice] / 255) * 140;
            const x = centroX + Math.cos(ang + tiempo + k) * radio;
            const y = centroY + Math.sin(ang + tiempo + k) * radio;

            if (ang === 0) contexto.moveTo(x, y);
            else contexto.lineTo(x, y);
        }
        contexto.closePath();
        contexto.stroke();
    }
}

/* ========================================
   LÓGICA DE LA BARRA DE REPRODUCCIÓN
   ======================================== */

// Formatear tiempo en MM:SS
function formatearTiempo(segundos) {
    if (!isFinite(segundos)) return '0:00';
    const minutos = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    return `${minutos}:${segs < 10 ? '0' : ''}${segs}`;
}

// Actualizar barra de progreso
reproductorAudio.addEventListener('timeupdate', () => {
    if (reproductorAudio.duration) {
        const porcentaje = (reproductorAudio.currentTime / reproductorAudio.duration) * 100;
        progreso.style.width = porcentaje + '%';
        tiempoActual.textContent = formatearTiempo(reproductorAudio.currentTime);
    }
});

// Actualizar duración total
reproductorAudio.addEventListener('loadedmetadata', () => {
    tiempoTotal.textContent = formatearTiempo(reproductorAudio.duration);
});

// Click en la barra de progreso para saltar
contenedorProgreso.addEventListener('click', (e) => {
    if (!reproductorAudio.src) return;
    const rect = contenedorProgreso.getBoundingClientRect();
    const porcentaje = (e.clientX - rect.left) / rect.width;
    reproductorAudio.currentTime = porcentaje * reproductorAudio.duration;
});

// ========== MOSTRAR/OCULTAR BARRA CON MOUSE (estilo YouTube) ==========
let timeoutOcultarBarra;
let estaEnFullscreen = false;

function mostrarBarra() {
    barraReproduccion.classList.remove('oculta');
    clearTimeout(timeoutOcultarBarra);
    
    // Ocultar después de 2 segundos sin movimiento (solo en fullscreen)
    if (estaEnFullscreen) {
        timeoutOcultarBarra = setTimeout(() => {
            barraReproduccion.classList.add('oculta');
        }, 2000);
    }
}

// Mostrar barra al mover mouse (en toda la pantalla cuando está en fullscreen)
document.addEventListener('mousemove', () => {
    if (estaEnFullscreen) {
        mostrarBarra();
    }
});

document.addEventListener('mouseenter', () => {
    if (estaEnFullscreen) {
        mostrarBarra();
    }
});

// Al entrar o salir de pantalla completa
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        // Entrar a pantalla completa
        estaEnFullscreen = true;
        barraReproduccion.classList.remove('oculta');
        mostrarBarra();
    } else {
        // Salir de pantalla completa
        estaEnFullscreen = false;
        barraReproduccion.classList.remove('oculta');
        clearTimeout(timeoutOcultarBarra);
    }
});

// ========== VELOCIDAD DE REPRODUCCIÓN ==========
let velocidadActual = 1;
const velocidades = [0.5, 0.75, 1, 1.25, 1.5, 2];

function crearMenuVelocidades() {
    const opcionVelocidad = document.querySelector('[data-opcion="velocidad"]');
    if (!opcionVelocidad) return;
    
    let html = '<div style="padding: 8px 16px;">';
    html += '<div style="font-size: 12px; color: rgba(232, 251, 255, 0.6); margin-bottom: 8px;">Velocidad de reproducción</div>';
    html += '<div style="display: flex; gap: 6px; flex-wrap: wrap;">';
    
    velocidades.forEach(v => {
        const activo = v === velocidadActual ? 'active' : '';
        html += `
            <button class="boton-velocidad ${activo}" data-velocidad="${v}" 
                    style="flex: 1; min-width: 45px; padding: 6px; background: ${v === velocidadActual ? 'rgba(155, 107, 255, 0.3)' : 'rgba(155, 107, 255, 0.1)'}; border: 1px solid rgba(155, 107, 255, 0.3); color: #9b6bff; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s ease;">
                ${v === 1 ? 'Normal' : v + 'x'}
            </button>
        `;
    });
    
    html += '</div></div>';
    opcionVelocidad.innerHTML = html;
    
    document.querySelectorAll('.boton-velocidad').forEach(btn => {
        btn.addEventListener('click', () => {
            const vel = parseFloat(btn.getAttribute('data-velocidad'));
            reproductorAudio.playbackRate = vel;
            velocidadActual = vel;
            crearMenuVelocidades();
        });
    });
}

// ========== MENÚ SETTINGS ==========
botonSettings.addEventListener('click', (e) => {
    e.stopPropagation();
    const estaAbierto = menuSettings.getAttribute('aria-hidden') === 'false';
    menuSettings.setAttribute('aria-hidden', estaAbierto ? 'true' : 'false');
    
    if (!estaAbierto) {
        crearMenuVelocidades();
    }
});

// Cerrar menú settings al hacer click fuera
document.addEventListener('click', (evento) => {
    if (!botonSettings.contains(evento.target) && !menuSettings.contains(evento.target)) {
        menuSettings.setAttribute('aria-hidden', 'true');
    }
});

// Evento de opción Animación
const opcionAnimacion = document.querySelector('[data-opcion="animacion"]');
const submenuAnimaciones = document.getElementById('submenu-animaciones');

if (opcionAnimacion) {
    opcionAnimacion.addEventListener('click', () => {
        // Toggle del submenu
        const estaOculto = submenuAnimaciones.getAttribute('aria-hidden') === 'true';
        submenuAnimaciones.setAttribute('aria-hidden', estaOculto ? 'false' : 'true');
    });
}

// Opciones del submenu de animaciones
const opcionesSubmenu = document.querySelectorAll('.opcion-submenu');
opcionesSubmenu.forEach(opcion => {
    opcion.addEventListener('click', (e) => {
        e.stopPropagation();
        const tipoNuevo = opcion.getAttribute('data-tipo');
        tipoAnimacion = tipoNuevo;
        
        // Actualizar el texto del selector principal
        const textosAnimacion = {
            'onda': 'Onda',
            'barras': 'Barras',
            'estrellas': 'Estrellas',
            'puntos': 'Puntos',
            'curvas': 'Curvas'
        };
        botonSelector.textContent = textosAnimacion[tipoNuevo] || 'Seleccione un tipo de animación.';
        
        // Agregar al historial si hay una canción cargada
        if (nombreCancionActual) {
            const ultima = historialCanciones[historialCanciones.length - 1];
            if (!ultima || ultima.nombre !== nombreCancionActual || ultima.tipo !== tipoNuevo) {
                agregarAlHistorial(nombreCancionActual, tipoNuevo);
            }
        }
        
        // Verificar y habilitar Play si corresponde
        verificarYHabilitarPlay();
        
        // Cerrar el submenu
        submenuAnimaciones.setAttribute('aria-hidden', 'true');
    });
});

// Evento de opción Paleta de colores
const opcionPaleta = document.querySelector('[data-opcion="paleta"]');
const submenuPaletas = document.getElementById('submenu-paletas');

if (opcionPaleta) {
    opcionPaleta.addEventListener('click', () => {
        // Toggle del submenu de paletas
        const estaOculto = submenuPaletas.getAttribute('aria-hidden') === 'true';
        submenuPaletas.setAttribute('aria-hidden', estaOculto ? 'false' : 'true');
    });
}

// Opciones del submenu de paletas
const opcionesSubmenuPaleta = document.querySelectorAll('.opcion-submenu-paleta');
opcionesSubmenuPaleta.forEach(opcion => {
    opcion.addEventListener('click', (e) => {
        e.stopPropagation();
        const paletaNueva = opcion.getAttribute('data-paleta');
        paletaActual = paletaNueva;
        
        // Actualizar el texto del selector de paletas si existe
        if (botonSelectorPaleta) {
            botonSelectorPaleta.innerHTML = `Paleta seleccionada: <strong>${paletas[paletaNueva].nombre}</strong>`;
            botonSelectorPaleta.style.color = '#5be6d6';
        }
        
        console.log('Paleta cambiada a:', paletas[paletaNueva].nombre);
        
        // Verificar y habilitar Play si corresponde
        verificarYHabilitarPlay();
        
        // Cerrar el submenu
        submenuPaletas.setAttribute('aria-hidden', 'true');
    });
});

/* Cerrar menús al hacer click fuera */
document.addEventListener('click', (evento) => {
    if (!botonSelector.contains(evento.target) && !menuAnimaciones.contains(evento.target)) {
        menuAnimaciones.classList.remove('mostrar');
        menuAnimaciones.setAttribute('aria-hidden', 'true');
    }
    
    if (!botonSelectorPaleta.contains(evento.target) && !menuPaletas.contains(evento.target)) {
        menuPaletas.classList.remove('mostrar');
        menuPaletas.setAttribute('aria-hidden', 'true');
    }
    
    if (!botonDemo.contains(evento.target) && !menuDemos.contains(evento.target)) {
        menuDemos.classList.remove('mostrar');
        menuDemos.setAttribute('aria-hidden', 'true');
    }
    
    if (!botonMenu.contains(evento.target) && !menuHistorial.contains(evento.target)) {
        menuHistorial.classList.remove('abierto');
    }
});

// Pantalla completa para el contenedor (canvas + barra) - Toggle
btnFullscreen.addEventListener('click', () => {
    if (document.fullscreenElement) {
        // Si ya está en fullscreen, salir
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        // Si no está en fullscreen, entrar
        if (contenedorCanvas.requestFullscreen) {
            contenedorCanvas.requestFullscreen();
        } else if (contenedorCanvas.webkitRequestFullscreen) {
            contenedorCanvas.webkitRequestFullscreen();
        } else if (contenedorCanvas.msRequestFullscreen) {
            contenedorCanvas.msRequestFullscreen();
        }
    }
});