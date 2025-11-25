const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const path = require("path");

const app = express();

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: '*',
    exposedHeaders: ['X-Video-Title', 'Content-Type', 'Content-Length']
}));

// Servir archivos estáticos (HTML, CSS, JS, imágenes, audio)
app.use(express.static(path.join(__dirname, '../../')));

// Crear agente personalizado con cookies para evitar rate limits
const agent = ytdl.createAgent();

// Configurar opciones de ytdl con agente personalizado y headers mejorados
const ytdlOptions = {
    agent,
    requestOptions: {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Upgrade-Insecure-Requests': '1'
        }
    }
};

// Endpoint para obtener información del video
app.get("/youtube/info", async (req, res) => {
    try {
        const url = req.query.url;
        
        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).json({ error: "URL de YouTube inválida" });
        }

        console.log(`🔍 Obteniendo info de: ${url}`);

        // Intentar con reintentos en caso de error 429
        let retries = 3;
        let info;
        
        while (retries > 0) {
            try {
                info = await ytdl.getInfo(url, ytdlOptions);
                break;
            } catch (err) {
                retries--;
                if (retries === 0) throw err;
                console.log(`⚠️ Reintentando... (${retries} intentos restantes)`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // esperar 2 segundos
            }
        }

        const title = info.videoDetails.title || "YouTube Audio";
        const duration = info.videoDetails.lengthSeconds || 0;
        const thumbnail = info.videoDetails.thumbnails?.[0]?.url || "";

        res.json({
            title: title,
            duration: duration,
            thumbnail: thumbnail
        });

        console.log(`✅ Info obtenida: ${title}`);

    } catch (err) {
        console.error("❌ Error obteniendo info de YouTube:", err.message);
        
        if (err.message.includes('429')) {
            res.status(429).json({ 
                error: "YouTube está limitando las peticiones. Intenta de nuevo en unos minutos o usa un archivo local/demo." 
            });
        } else {
            res.status(500).json({ error: "No se pudo obtener información del video: " + err.message });
        }
    }
});

// Endpoint para streaming directo de audio
app.get("/youtube/stream", async (req, res) => {
    try {
        const url = req.query.url;
        
        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).send("URL de YouTube inválida");
        }

        console.log(`📥 Streaming directo para: ${url}`);

        // Obtener info del video
        const info = await ytdl.getInfo(url, ytdlOptions);
        const title = info.videoDetails.title || "YouTube Audio";
        
        console.log(`🎵 Iniciando streaming: ${title}`);

        // Configurar headers
        res.setHeader("Content-Type", "audio/webm");
        res.setHeader("X-Video-Title", encodeURIComponent(title));
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Accept-Ranges", "bytes");

        // Stream de audio con configuración mejorada
        const audioStream = ytdl(url, {
            filter: 'audioonly',
            quality: 'lowestaudio',
            requestOptions: ytdlOptions.requestOptions,
            // Agregar delay entre peticiones
            highWaterMark: 1 << 25
        });

        console.log(`✅ Stream iniciado para: ${title}`);

        // Manejar eventos del stream
        audioStream.on('error', (err) => {
            console.error("❌ Error en stream:", err.message);
            if (!res.headersSent) {
                res.status(500).send("Error en streaming");
            }
        });

        audioStream.on('end', () => {
            console.log("✅ Stream completado");
        });

        // Limpiar cuando el cliente cierra la conexión
        res.on('close', () => {
            audioStream.destroy();
        });

        // Pipe del stream al response
        audioStream.pipe(res);

    } catch (err) {
        console.error("❌ Error en streaming:", err.message);
        if (!res.headersSent) {
            res.status(500).send("Error: " + err.message);
        }
    }
});
// Ruta principal - servir index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// Ruta para el visualizador
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, '../../home.html'));
});

// Ruta para verificar estado del servidor
app.get("/api/status", (req, res) => {
    res.json({ status: "Servidor funcionando correctamente", version: "1.0.0" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n🎵 Servidor de YouTube Audio iniciado`);
    console.log(`📡 Escuchando en http://localhost:${PORT}`);
    console.log(`✅ Listo para recibir peticiones\n`);
});
