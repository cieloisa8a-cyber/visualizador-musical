const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: '*'
}));

// Servir archivos estáticos (HTML, CSS, JS, imágenes, audio)
app.use(express.static(path.join(__dirname, '../../')));

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
    console.log(`\n🎵 Servidor de Visualizador Musical iniciado`);
    console.log(`📡 Escuchando en http://localhost:${PORT}`);
    console.log(`✅ Listo para recibir peticiones\n`);
});
