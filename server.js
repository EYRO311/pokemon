const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware para analizar datos en formato JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal que redirige al archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pokemon.html'));
});

// Ruta para guardar el equipo en el archivo JSON
app.post('/saveTeam', (req, res) => {
    const { username, team } = req.body;

    if (!username || !team) {
        return res.status(400).json({ error: "Faltan datos para guardar el equipo." });
    }

    const filePath = path.join(__dirname, 'data', 'pokemon.json');

    // Crear el directorio data si no existe
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'));
    }

    const teamData = {
        username: username,
        team: team
    };

    fs.writeFile(filePath, JSON.stringify(teamData, null, 2), (err) => {
        if (err) {
            console.error("Error al guardar el equipo:", err);
            return res.status(500).json({ error: "Error al guardar el equipo." });
        }

        console.log("Equipo guardado correctamente:", teamData);
        res.status(200).json({ message: "Equipo guardado exitosamente." });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
