const express = require('express');
const path = require('path'); // Módulo para manejar rutas
const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal que redirige al archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pokemon.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
