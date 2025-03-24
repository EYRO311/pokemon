const typeColor = {
    bug: "#86c263",
    dragon: "#203178",
    electric: "#f3db13",
    fairy: "#ff00d8",
    fighting: "#ac0505",
    fire: "#ff7400",
    flying: "#d3d3d3",
    grass: "#13b62e",
    ground: "#daaa22",
    ghost: "#9551e9",
    ice: "#1ee5f5",
    normal: "#cea9cf",
    poison: "#99039e",
    psychic: "#ff00b1",
    rock: "#967830",
    water: "#2777ff ",
    dark: "#0a1f44",
    steel: "#808080"
};

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

// Buscar Pokémon por nombre
searchButton.addEventListener("click", () => {
    const pokemonName = searchInput.value.trim().toLowerCase();
    if (pokemonName) {
        fetch(url + pokemonName)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Pokémon no encontrado");
            }
            return response.json();
        })
        .then((data) => {
            generateCard(data);
        })
        .catch(() => {
            card.innerHTML = `<p style="color: red;">Pokémon no encontrado</p>`;
        });
    }
});

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

// Generar Pokémon por región
let generatePokemonByRange = (min, max) => {
    let id = Math.floor(Math.random() * (max - min + 1)) + min;
    const finalUrl = url + id;

    fetch(finalUrl)
        .then((response) => response.json())
        .then((data) => {
            generateCard(data);
        });
};

// Generar carta de Pokémon
let generateCard = (data) => {
    const hp = data.stats[0].base_stat;
    const attack = data.stats[1].base_stat;
    const defense = data.stats[2].base_stat;
    const specialAttack = data.stats[3].base_stat;
    const specialDefense = data.stats[4].base_stat;
    const speed = data.stats[5].base_stat;

    const imgSrc = data.sprites.front_default;     // Imagen normal
    const imgShinySrc = data.sprites.front_shiny;  // Imagen shiny

    const pokeName = data.name[0].toUpperCase() + data.name.slice(1);
    const pokeId = data.id;

    const randomAbility = data.abilities[Math.floor(Math.random() * data.abilities.length)].ability.name;

    const themeColor = typeColor[data.types[0].type.name];

    card.innerHTML = `
        <p class="pokedex-id">#${pokeId}</p>
        <p class="hp">
            <span>HP</span>
            ${hp}
        </p>

        <div class="image-container">
            <div class="image-box">
                <img src=${imgSrc} alt="${pokeName} Normal" />
                <p class="image-label">Normal</p>
            </div>
            <div class="image-box">
                <img src=${imgShinySrc} alt="${pokeName} Shiny" />
                <p class="image-label">Shiny</p>
            </div>
        </div>

        <h2 class="poke-name">${pokeName}</h2>
        <div class="types"></div>
    `;

    appendTypes(data.types);
    styleCard(themeColor);
};

let appendTypes = (types) => {
    const typesContainer = document.querySelector(".types");
    typesContainer.innerHTML = ""; // Limpiar para evitar duplicados

    types.forEach((item) => {
        let span = document.createElement("SPAN");
        span.textContent = item.type.name.toUpperCase();
        span.style.backgroundColor = typeColor[item.type.name];
        span.classList.add("poke-type");
        typesContainer.appendChild(span);
    });
};

let styleCard = (color) => {
    card.style.background = `radial-gradient(circle at 50% 0%, ${color} 42%, #ffffff 36%)`;
    card.querySelectorAll(".types span").forEach((typeColor) => {
        typeColor.style.color = "#ffffff";
    });
};

btn.addEventListener("click", getPokeData);
btnk.addEventListener("click", () => generatePokemonByRange(1, 151));  
btnj.addEventListener("click", () => generatePokemonByRange(152, 251)); 
btnh.addEventListener("click", () => generatePokemonByRange(252, 386)); 
btns.addEventListener("click", () => generatePokemonByRange(387, 493)); 
btnu.addEventListener("click", () => generatePokemonByRange(494, 649));
btnka.addEventListener("click", () => generatePokemonByRange(650, 721));
btna.addEventListener("click", () => generatePokemonByRange(722, 809));
btng.addEventListener("click", () => generatePokemonByRange(810, 898));
btnp.addEventListener("click", () => generatePokemonByRange(899, 1010));

window.addEventListener("load", getPokeData);