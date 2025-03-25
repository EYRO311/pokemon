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

// Ruta para guardar el equipo
app.post('/saveTeam', (req, res) => {
    const { username, team } = req.body;

    if (!username || !team || team.length !== 6) {
        return res.status(400).json({ error: "El equipo debe tener exactamente 6 Pokémon y un nombre de usuario válido." });
    }

    const filePath = path.join(__dirname, 'data', 'pokemon.json');

    // Leer el archivo actual para no sobreescribir equipos anteriores
    fs.readFile(filePath, 'utf8', (err, data) => {
        let teams = [];
    
        if (!err && data) {
            try {
                teams = JSON.parse(data);
                if (!Array.isArray(teams)) {
                    teams = [];  // Si no es un array, se fuerza como array vacío
                }
            } catch (error) {
                console.error('Error al leer el JSON:', error);
                teams = []; // Si hay error al leer el JSON, crea un array vacío
            }
        }
    
        // Agregar el nuevo equipo
        teams.push({ username, team });
    
        // Escribir el nuevo JSON actualizado
        fs.writeFile(filePath, JSON.stringify(teams, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el equipo:', err);
                return res.status(500).json({ error: "Error al guardar el equipo." });
            }
            res.status(200).json({ message: "Equipo guardado exitosamente." });
        });
    });
    
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});