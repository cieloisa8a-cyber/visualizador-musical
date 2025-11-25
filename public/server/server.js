const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const axios = require("axios");
const path = require("path");

const app = express();

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: '*',
    exposedHeaders: ['X-Video-Title', 'Content-Type', 'Content-Length']
}));

// Servir archivos estáticos (HTML, CSS, JS, imágenes, audio)
app.use(express.static(path.join(__dirname, '../../')));

// Configurar opciones simplificadas (sin agente personalizado que puede causar problemas)
const ytdlOptions = {
    requestOptions: {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        }
    }
};

// Cache simple para evitar peticiones repetidas
const videoCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// Lista de instancias públicas de Invidious (API alternativa de YouTube)
const INVIDIOUS_INSTANCES = [
    'https://invidious.fdn.fr',
    'https://invidious.privacydev.net',
    'https://inv.nadeko.net',
    'https://invidious.slipfox.xyz'
];

// Función para obtener info usando Invidious (método alternativo)
async function getYouTubeInfoViaInvidious(videoId) {
    for (const instance of INVIDIOUS_INSTANCES) {
        try {
            console.log(`🔄 Intentando Invidious: ${instance}`);
            const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, {
                timeout: 5000,
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });
            
            if (response.data) {
                console.log(`✅ Invidious exitoso: ${instance}`);
                return {
                    title: response.data.title,
                    duration: response.data.lengthSeconds,
                    thumbnail: response.data.videoThumbnails?.[0]?.url || '',
                    audioUrl: response.data.adaptiveFormats?.find(f => f.type?.includes('audio'))?.url
                };
            }
        } catch (err) {
            console.log(`❌ Invidious falló (${instance}): ${err.message}`);
            continue;
        }
    }
    throw new Error('Todos los servicios de Invidious fallaron');
}

// Extraer ID de video de YouTube
function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v');
        } else if (urlObj.hostname.includes('youtu.be')) {
            return urlObj.pathname.slice(1);
        }
    } catch (e) {
        return null;
    }
    return null;
}

// Endpoint para obtener información del video
app.get("/youtube/info", async (req, res) => {
    try {
        const url = req.query.url;
        
        if (!url) {
            return res.status(400).json({ error: "URL requerida" });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({ error: "URL de YouTube inválida" });
        }

        console.log(`🔍 Obteniendo info de: ${url} (ID: ${videoId})`);

        // Verificar caché primero
        const cachedData = videoCache.get(videoId);
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
            console.log(`📦 Usando caché para: ${cachedData.title}`);
            return res.json(cachedData.data);
        }

        let videoInfo = null;
        let method = 'unknown';

        // MÉTODO 1: Intentar con ytdl-core primero
        if (ytdl.validateURL(url)) {
            try {
                console.log('🎬 Método 1: Intentando ytdl-core...');
                const info = await Promise.race([
                    ytdl.getBasicInfo(url, ytdlOptions),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                
                videoInfo = {
                    title: info.videoDetails.title,
                    duration: info.videoDetails.lengthSeconds,
                    thumbnail: info.videoDetails.thumbnails?.[0]?.url || ''
                };
                method = 'ytdl-core';
                console.log('✅ ytdl-core exitoso');
            } catch (err) {
                console.log(`⚠️ ytdl-core falló: ${err.message}`);
            }
        }

        // MÉTODO 2: Si ytdl-core falla, usar Invidious
        if (!videoInfo) {
            try {
                console.log('🎬 Método 2: Intentando Invidious...');
                videoInfo = await getYouTubeInfoViaInvidious(videoId);
                method = 'invidious';
            } catch (err) {
                console.log(`⚠️ Invidious falló: ${err.message}`);
            }
        }

        // Si ningún método funciona, devolver error
        if (!videoInfo) {
            throw new Error('No se pudo obtener información del video con ningún método');
        }

        const response = {
            title: videoInfo.title || "YouTube Audio",
            duration: videoInfo.duration || 0,
            thumbnail: videoInfo.thumbnail || '',
            method: method  // Para debugging
        };

        // Guardar en caché
        videoCache.set(videoId, {
            data: response,
            title: videoInfo.title,
            timestamp: Date.now()
        });

        res.json(response);
        console.log(`✅ Info obtenida con ${method}: ${videoInfo.title}`);

    } catch (err) {
        console.error("❌ Error obteniendo info de YouTube:", err.message);
        res.status(500).json({ 
            error: "YouTube temporalmente no disponible. Usa los demos incluidos o carga un archivo MP3 local." 
        });
    }
});

// Endpoint para streaming directo de audio
app.get("/youtube/stream", async (req, res) => {
    try {
        const url = req.query.url;
        const videoId = extractVideoId(url);
        
        if (!videoId) {
            return res.status(400).send("URL de YouTube inválida");
        }

        console.log(`📥 Streaming directo para: ${url}`);

        // MÉTODO 1: Intentar ytdl-core primero
        if (ytdl.validateURL(url)) {
            try {
                console.log('🎬 Streaming: Intentando ytdl-core...');
                const info = await ytdl.getInfo(url, ytdlOptions);
                const title = info.videoDetails.title || "YouTube Audio";
                
                console.log(`🎵 Iniciando streaming con ytdl-core: ${title}`);

                // Configurar headers
                res.setHeader("Content-Type", "audio/webm");
                res.setHeader("X-Video-Title", encodeURIComponent(title));
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Cache-Control", "no-cache");
                res.setHeader("Accept-Ranges", "bytes");

                // Stream de audio
                const audioStream = ytdl(url, {
                    filter: 'audioonly',
                    quality: 'lowestaudio',
                    requestOptions: ytdlOptions.requestOptions,
                    highWaterMark: 1 << 25
                });

                console.log(`✅ Stream ytdl-core iniciado para: ${title}`);

                audioStream.on('error', (err) => {
                    console.error("❌ Error en stream ytdl-core:", err.message);
                });

                audioStream.on('end', () => {
                    console.log("✅ Stream ytdl-core completado");
                });

                res.on('close', () => {
                    audioStream.destroy();
                });

                audioStream.pipe(res);
                return; // Éxito con ytdl-core
                
            } catch (err) {
                console.log(`⚠️ ytdl-core stream falló: ${err.message}`);
            }
        }

        // MÉTODO 2: Usar Invidious como fallback
        console.log('🎬 Streaming: Intentando Invidious...');
        const videoInfo = await getYouTubeInfoViaInvidious(videoId);
        
        if (videoInfo.audioUrl) {
            console.log(`🎵 Redirigiendo a audio de Invidious`);
            // Proxy el audio de Invidious
            const audioResponse = await axios.get(videoInfo.audioUrl, {
                responseType: 'stream',
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            
            res.setHeader("Content-Type", "audio/webm");
            res.setHeader("X-Video-Title", encodeURIComponent(videoInfo.title));
            res.setHeader("Access-Control-Allow-Origin", "*");
            
            audioResponse.data.pipe(res);
            console.log(`✅ Stream Invidious iniciado`);
        } else {
            throw new Error('No se pudo obtener URL de audio');
        }

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
