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

##  Despliegue en Producción (Render.com)

### Paso 1: Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit - Visualizador Musical Web"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/visualizador-musical.git
git push -u origin main
```

### Paso 2: Configurar Render

1. Ir a [Render.com](https://render.com) y crear cuenta
2. Clic en "New +" → "Web Service"
3. Conectar tu repositorio de GitHub
4. Configuración:
   - **Name**: visualizador-musical
   - **Environment**: Node
   - **Build Command**: `npm run install-server`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Clic en "Create Web Service"

¡Listo! Render te dará una URL pública como:  
`https://visualizador-musical.onrender.com`

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
- @distube/ytdl-core

##  Licencia

MIT License - Proyecto académico

---

**Universidad de San Buenaventura Medellín - 2025**
