#  Visualizador Musical Web

Aplicación web interactiva que transforma música en arte visual usando Web Audio API y Canvas.

##  Desarrolladoras

- **Cielo Isabel Ochoa Betancur** - Ingeniería de Sonido
- **María Alejandra Restrepo García** - Ingeniería Multimedia

Universidad de San Buenaventura - Medellín  
Programación 2 - Segundo Semestre 2025

##  Características

-  **5 Visualizaciones**: Onda, Barras, Estrellas, Puntos, Curvas
-  **3 Paletas de Colores**: Neón, Cálida, Fría (organizadas por frecuencias)
-  **Soporte YouTube**: Carga directa de videos de YouTube
-  **Archivos locales**: MP3 y WAV
-  **8 Demos**: Canciones pregrabadas de diferentes géneros
-  **Controles**: Velocidad de reproducción, pantalla completa
-  **Historial**: Guarda tus reproducciones

##  Despliegue Local

### Requisitos
- Node.js 18 o superior
- npm

### Instalación

1. Instalar dependencias del servidor:
```bash
npm run install-server
```

2. Iniciar servidor:
```bash
npm start
```

3. Abrir en navegador:
```
http://localhost:3001
```

<<<<<<< HEAD
##  Despliegue en Producción
=======
##  Despliegue en Producción (Render.com)
>>>>>>> 3fab5ee7bdd631144f7590a0be51a711f7a279ac

El proyecto está configurado para desplegarse en Render.com (plan gratuito).

**Nota**: El plan gratuito "duerme" el servidor después de 15 minutos de inactividad. La primera carga puede tardar 30-50 segundos mientras reactiva, después funciona normal.

### Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Desplegar en Render
1. Crear cuenta en render.com
2. New Web Service → conectar repositorio
3. Configurar:
   - Build: `npm run install-server`
   - Start: `npm start`
4. Deploy

URL pública: `https://TU-APP.onrender.com`

##  Estructura del Proyecto

```
landing page/
├── index.html              # Landing page
├── home.html              # Aplicación principal
├── package.json           # Configuración Node.js
├── README.md              # Este archivo
│
└── public/
    ├── assets/            # Recursos multimedia
    │   ├── audios demo/   # 8 archivos de audio demo
    │   └── imagenes/      # Imágenes de la landing
    │
    ├── scripts/
    │   ├── app.js         # Lógica del visualizador
    │   └── script.js      # Lógica de la landing
    │
    ├── styles/
    │   ├── style_app.css  # Estilos del visualizador
    │   └── style_landing.css
    │
    └── server/
        ├── server.js      # Servidor Express + ytdl-core
        └── package.json   # Dependencias del servidor
```

##  Tecnologías

- HTML5 Canvas
- Web Audio API (FFT)
- JavaScript ES6+
- CSS3 (Glassmorphism)
- Node.js + Express

##  Licencia

MIT License - Proyecto académico

---

**Universidad de San Buenaventura Medellín - 2025**
