const typeColor = {
    bug: "#86c263",
    dragon: "#2895a0",
    electric: "#f3db13",
    fairy: "#ba3562",
    fighting: "#ac0505",
    fire: "#e91b1b",
    flying: "#7e7e7e",
    grass: "#429a21",
    ground: "#967830",
    ghost: "#9551e9",
    ice: "#98edef",
    normal: "#cea9cf",
    poison: "#99039e",
    psychic: "#ff00b1",
    rock: "#978b65",
    water: "#356cba ",
    dark: "#503581",
    steel: "#808080"
};

const socket = io();

// Enviar evento cuando un usuario ingresa
document.getElementById('usernameInput').addEventListener('input', () => {
    const username = document.getElementById('usernameInput').value;
    if (username.trim() !== '') {
        socket.emit('usuarioIngresado', username);
    }
});

// Input del nombre del usuario y botón para guardar
const usernameInput = document.getElementById("usernameInput"); 

// Array para almacenar el equipo de Pokémon
let pokemonTeam = [];

// Constructor para Pokémon
class Pokemon {
  constructor(id, name, pokedexNumber, attack, defense, specialAttack, specialDefense, moves, types, shiny) {
      this.id = id;
      this.name = name;
      this.pokedexNumber = pokedexNumber;
      this.attack = attack;
      this.defense = defense;
      this.specialAttack = specialAttack;
      this.specialDefense = specialDefense;
      this.moves = moves;
      this.types = types;
      this.shiny = shiny;
  } 
}

function savePokemonToTeam(data) {
    // Verificar si ya hay 6 Pokémon en el equipo
    if (pokemonTeam.length >= 6) {
        alert("¡No puedes tener más de 6 Pokémon en tu equipo!");
        return; // No permite agregar más de 6 Pokémon
    }

    const randomMoves = data.moves
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map(move => move.move.name);

    const shiny = Math.random() < 0.5 ? true : false;

    const pokemon = new Pokemon(
        crypto.randomUUID(),         // ID único
        data.name,
        data.id,                     // Número de Pokédex
        data.stats[1].base_stat,     // Ataque
        data.stats[2].base_stat,     // Defensa
        data.stats[3].base_stat,     // Ataque Especial
        data.stats[4].base_stat,     // Defensa Especial
        randomMoves,
        data.types.map(type => type.type.name), // Tipos
        shiny
    );

    pokemonTeam.push(pokemon);
    displaySelectedTeam();

    // Mostrar el botón Ready cuando se tengan 6 Pokémon
    if (pokemonTeam.length === 6) {
        displayReadyButton();
    }
}

// Enviar evento cuando se guarde el equipo
function guardarEquipo(username, pokemonTeam) {
    fetch('/saveTeam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, team: pokemonTeam })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al guardar el equipo.");
        }
        socket.emit('equipoGuardado', { username });  // Notificar al servidor
        console.log(`Equipo guardado exitosamente para ${username}`);
    })
    .catch(error => console.error('Error al guardar el equipo:', error));
}

// Notificación visual de los eventos en tiempo real
socket.on('nuevoIngreso', (username) => {
    console.log(`¡Nuevo usuario conectado: ${username}!`);
});

socket.on('equipoGuardadoExito', (username) => {
    console.log(`El equipo de ${username} se guardó exitosamente.`);
});

// Nueva función para mostrar el botón "Ready"
function displayReadyButton() {
    // Verifica si el botón ya existe para no duplicarlo
    if (!document.getElementById("ready-button")) {
        const readyButton = document.createElement("button");
        readyButton.id = "ready-button";
        readyButton.textContent = "Ready";
        readyButton.classList.add("btn-ready");

        readyButton.addEventListener("click", () => {
            const username = usernameInput.value.trim();  // Nombre de usuario
        
            if (!username) {
                alert("Por favor, ingresa tu nombre antes de guardar el equipo.");
                return;
            }
        
            // Datos del equipo
            const teamData = {
                username: username,
                team: pokemonTeam  // Aquí se pasan los datos del equipo
            };
        
            // Enviar datos al servidor
            fetch('/saveTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, team: pokemonTeam })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en el servidor");
                }
                return response.json();
            })
            .then(data => {
                console.log("Equipo guardado con éxito:", data);
                alert(`¡Equipo guardado exitosamente como "${username}"!`);
        
                // Limpiar el equipo y ocultar el botón Ready
                pokemonTeam = [];
                displaySelectedTeam();
                readyButton.remove();
            })
            .catch(error => console.error("Error al guardar el equipo:", error));
        });        

        // Mostrar el botón "Ready" junto al equipo seleccionado
        selectedTeamContainer.parentElement.appendChild(readyButton);
    }
}

// Guardar Pokémon desde el botón "Seleccionar"
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-seleccionar")) {
      const username = usernameInput.value.trim();

      if (!username) {
          alert("Por favor, ingresa tu nombre antes de seleccionar un Pokémon.");
          return;
      }

      const pokemonCard = event.target.closest(".pokemon-card");
      const pokemonName = pokemonCard.querySelector(".poke-name").innerText;

      // Buscar el Pokémon en la API para obtener todos sus datos
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
          .then((response) => response.json())
          .then((data) => {
              savePokemonToTeam(data);
          })
          .catch((error) => console.error("Error al guardar el Pokémon:", error));
  }
});

const url = "https://pokeapi.co/api/v2/pokemon/";
const card = document.getElementById("card");
const btn = document.getElementById("btn");

// Botones de generación
const btnk = document.getElementById("btnk");
const btnj = document.getElementById("btnj");
const btnh = document.getElementById("btnh");
const btns = document.getElementById("btns");
const btnu = document.getElementById("btnu");
const btnka = document.getElementById("btnka");
const btna = document.getElementById("btna");
const btng = document.getElementById("btng");
const btnp = document.getElementById("btnp");

// Switch y elementos del buscador
const toggleSwitch = document.getElementById("toggleSwitch");
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const pokemonList = document.getElementById("pokemon-list");
const regionButtons = document.querySelector(".region-buttons");

// Alternar vista de botones, buscador y botón "Generar Aleatorio"
toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
        regionButtons.style.display = "none";
        searchContainer.style.display = "block";
        btn.style.display = "none";  // Ocultar botón "Generar Aleatorio"
    } else {
        regionButtons.style.display = "flex";
        searchContainer.style.display = "none";
        btn.style.display = "block";  // Mostrar botón "Generar Aleatorio"
    }
});

// Cargar lista de Pokémon para autocompletado
async function loadPokemonList() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=898");
    const data = await response.json();

    data.results.forEach(pokemon => {
        const option = document.createElement("option");
        option.value = pokemon.name;
        pokemonList.appendChild(option);
    });
}
loadPokemonList();

// Función para limpiar las cartas y mostrar solo 1 Pokémon cuando se usa el buscador manual
searchButton.addEventListener("click", () => {
  const pokemonName = searchInput.value.trim().toLowerCase();
  if (pokemonName) {
      card.innerHTML = ""; // LIMPIA EL CONTENEDOR ANTES DE MOSTRAR EL POKÉMON BUSCADO
      fetch(url + pokemonName)
          .then((response) => {
              if (!response.ok) throw new Error("Pokémon no encontrado");
              return response.json();
          })
          .then((data) => {
              generateCard(data); // Muestra solo 1 Pokémon
          })
          .catch(() => {
              card.innerHTML = `<p style="color: red;">Pokémon no encontrado</p>`;
          });
  }
});

// Contenedor del equipo seleccionado
const selectedTeamContainer = document.getElementById("selected-team");

// Función para mostrar el equipo seleccionado
function displaySelectedTeam() {
    selectedTeamContainer.innerHTML = ""; // Limpiar el contenedor antes de actualizar

    pokemonTeam.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("selected-card");
        card.style.backgroundColor = typeColor[pokemon.types[0]] || "#808080";

        card.innerHTML = `
            <div class="pokemon-header">
                <img src="${pokemon.shiny ? 
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.pokedexNumber}.png` : 
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`}" 
                    alt="${pokemon.name}" class="pokemon-image"/>
                <h3>${pokemon.name}</h3>
                <button class="btn-eliminar" data-id="${pokemon.id}">Eliminar</button>
            </div>
        `;

        selectedTeamContainer.appendChild(card);

        const btnEliminar = card.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click", () => eliminarPokemon(pokemon.id));
    });
}

// Eliminar Pokémon del equipo
function eliminarPokemon(id) {
    pokemonTeam = pokemonTeam.filter(pokemon => pokemon.id !== id);
    displaySelectedTeam(); // Actualizar la vista
}

// Generar Pokémon aleatorio
let getPokeData = () => {
    let id = Math.floor(Math.random() * 1010) + 1;
    const finalUrl = url + id;

    fetch(finalUrl)
        .then((response) => response.json())
        .then((data) => {
            generateCard(data);
        });
};

// Generar 6 Pokémon aleatorios
let generateRandomPokemon = () => {
  card.innerHTML = ""; // Limpiar el contenedor antes de generar nuevos Pokémon

for (let i = 0; i < 6; i++) {
        let id = Math.floor(Math.random() * 1010) + 1; // Pokémon aleatorio de toda la base de datos
        const finalUrl = url + id;

        fetch(finalUrl)
        .then((response) => response.json())
        .then((data) => {
            generateCard(data);
        });
    }
};

// Generar 6 Pokémon por región (3 arriba y 3 abajo)
let generateMultiplePokemonByRange = (min, max) => {
  card.innerHTML = ""; // Limpiar el contenedor antes de generar nuevos Pokémon

  for (let i = 0; i < 6; i++) {
      let id = Math.floor(Math.random() * (max - min + 1)) + min;
      const finalUrl = url + id;

      fetch(finalUrl)
          .then((response) => response.json())
          .then((data) => {
              generateCard(data);
          });
  }
};

// Generar una carta de Pokémon
let generateCard = (data) => {
  const hp = data.stats[0].base_stat;
  const attack = data.stats[1].base_stat;
  const defense = data.stats[2].base_stat;
  const specialAttack = data.stats[3].base_stat;
  const specialDefense = data.stats[4].base_stat;
  const speed = data.stats[5].base_stat;

  const imgSrc = data.sprites.front_default;
  const imgShinySrc = data.sprites.front_shiny;

  const pokeName = data.name[0].toUpperCase() + data.name.slice(1);
  const pokeId = data.id;

  const randomAbility = data.abilities[Math.floor(Math.random() * data.abilities.length)].ability.name;

  const themeColor = typeColor[data.types[0].type.name];

  const cardElement = document.createElement("div");
  cardElement.classList.add("pokemon-card");

  cardElement.innerHTML = `
      <div class="pokedex-hp">
          <span class="pokedex-id">#${pokeId}</span>
          <span class="hp">HP ${hp}</span>
      </div>

      <div class="image-container">
          <div class="image-box">
              <img src=${imgSrc} alt="${pokeName} Normal" />
          </div>
          <div class="image-box">
              <img src=${imgShinySrc} alt="${pokeName} Shiny" />
          </div>
      </div>

      <h2 class="poke-name">${pokeName}</h2>
      <div class="types"></div>

      <div class="stats">
          <div class="main-stats">
              <div>
                  <h3>${attack}</h3>
                  <p>Ataque</p>
              </div>
              <div>
                  <h3>${specialAttack}</h3>
                  <p>Ataque Especial</p>
              </div>
              <div>
                  <h3>${defense}</h3>
                  <p>Defensa</p>
              </div>
              <div>
                  <h3>${specialDefense}</h3>
                  <p>Defensa Especial</p>
              </div>
          </div>
              <br>
          <div class="extra-stats">
              <div>
                  <h3>${speed}</h3>
                  <p>Velocidad</p>
              </div>
              <div>
                  <h3>${randomAbility}</h3>
                  <p>Habilidad</p>
              </div>
          </div>
      </div>
      <button class="btn-seleccionar">Seleccionar</button>
  `;

  appendTypes(data.types, cardElement);
  styleCard(themeColor, cardElement);

  card.appendChild(cardElement);
};

// Estilo para mostrar los tipos de Pokémon
let appendTypes = (types, cardElement) => {
  const typesContainer = cardElement.querySelector(".types");
  typesContainer.innerHTML = "";

  types.forEach((item) => {
      let span = document.createElement("SPAN");
      span.textContent = item.type.name.toUpperCase();
      span.style.backgroundColor = typeColor[item.type.name];
      span.classList.add("poke-type");
      typesContainer.appendChild(span);
  });
};

// Estilo de la carta
let styleCard = (color, cardElement) => {
  cardElement.style.background = `radial-gradient(circle at 50% 0%, ${color} 38%, #ffffff 36%)`;
  cardElement.querySelectorAll(".types span").forEach((typeColor) => {
      typeColor.style.color = "#ffffff";
  });
};

// Asignar el comportamiento al botón "Generar Aleatorio"
btn.addEventListener("click", generateRandomPokemon);
// Asignar el nuevo comportamiento a los botones de región
btnk.addEventListener("click", () => generateMultiplePokemonByRange(1, 151));  
btnj.addEventListener("click", () => generateMultiplePokemonByRange(152, 251)); 
btnh.addEventListener("click", () => generateMultiplePokemonByRange(252, 386)); 
btns.addEventListener("click", () => generateMultiplePokemonByRange(387, 493)); 
btnu.addEventListener("click", () => generateMultiplePokemonByRange(494, 649));
btnka.addEventListener("click", () => generateMultiplePokemonByRange(650, 721));
btna.addEventListener("click", () => generateMultiplePokemonByRange(722, 809));
btng.addEventListener("click", () => generateMultiplePokemonByRange(810, 898));
btnp.addEventListener("click", () => generateMultiplePokemonByRange(899, 1010));

window.addEventListener("load", getPokeData);