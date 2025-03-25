const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Middleware para analizar datos en formato JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO para eventos en tiempo real
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    // Avisar cuando un usuario se conecta con su nombre
    socket.on('usuarioIngresado', (username) => {
        console.log(`Usuario conectado: ${username}`);
        io.emit('nuevoIngreso', username);
    });

    // Avisar cuando un equipo es guardado
    socket.on('equipoGuardado', (data) => {
        console.log(`Equipo guardado para el usuario: ${data.username}`);
        io.emit('equipoGuardadoExito', data.username);
    });

    // Avisar cuando un usuario se desconecta
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

// Ruta principal que redirige al archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pokemon.html'));
});

// Ruta para guardar el equipo en el JSON
app.post('/saveTeam', (req, res) => {
    const { username, team } = req.body;

    if (!username || !team || team.length !== 6) {
        return res.status(400).json({ error: "El equipo debe tener exactamente 6 Pokémon y un nombre de usuario válido." });
    }

    const filePath = path.join(__dirname, 'data', 'pokemon.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let teams = [];
        if (!err && data) {
            try {
                teams = JSON.parse(data);
                if (!Array.isArray(teams)) {
                    teams = [];
                }
            } catch (error) {
                console.error('Error al leer el JSON:', error);
                teams = [];
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

            // Emitir el evento de equipo guardado para informar a todos los clientes
            io.emit('equipoGuardado', { username });

            res.status(200).json({ message: "Equipo guardado exitosamente." });
        });
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
