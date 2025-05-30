import 'flowbite';
import NodeCache from '@cacheable/node-cache';
import { fetchAPI } from '../pokeapi.js';

const cache = new NodeCache();
const limit = 20;
let currentPage = 1;

const typeColors = {
    normal: 'var(--color-normal)',
    grass: 'var(--color-grass)',
    bug: 'var(--color-bug)',
    poison: 'var(--color-poison)',
    fire: 'var(--color-fire)',
    water: 'var(--color-water)',
    electric: 'var(--color-electric)',
    psychic: 'var(--color-psychic)',
    fighting: 'var(--color-fighting)',
    ground: 'var(--color-ground)',
    rock: 'var(--color-rock)',
    flying: 'var(--color-flying)',
    ice: 'var(--color-ice)',
    dark: 'var(--color-dark)',
    ghost: 'var(--color-ghost)',
    dragon: 'var(--color-dragon)',
    fairy: 'var(--color-fairy)',
    steel: 'var(--color-steel)',
    metal: 'var(--color-metal)',
};

async function getPokemonByUrl(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        return 1;
    }
}

async function getPokemons(page = 1) {
    const offset = (page - 1) * limit;

    // Set cache key to page/${pageNumber}
    const key = `page/${page}`;
    if (cache.get(key)) {
        return cache.get(key);
    } else {
        const response = await fetchAPI('pokemon', offset, limit);
        const results = response.results;
        cache.set(key, results, 0);
        return results;
    }
}

async function renderPokemon(page) {
    const pokemons = document.getElementById('pokemons-list');
    pokemons.innerHTML = '';
    (async () => {
        const result = await getPokemons(page);
        if (result === 1) {
            console.log('error');
        } else {
            // Make sure all pokemon details are pulled before DOM manipulation
            const pokemonDetails = await Promise.all(
                result.map(async (element) => {
                    const pokemon = await getPokemonByUrl(element.url);
                    const id = pokemon.id;
                    const spriteUrl = pokemon.sprites.other['official-artwork'].front_default;
                    const types = pokemon.types;
                    const name = element.name;
                    const weight = pokemon.weight;
                    const height = pokemon.height;
                    const hp = pokemon.stats[0].base_stat;

                    return { id, name, spriteUrl, types, weight, height, hp };
                })
            );
            pokemonDetails.forEach((pokemon) => {
                // Pokemon Card
                const pokemon_card = document.createElement('a');
                const a = document.createAttribute('class');
                const pokemon_link = document.createAttribute('href');
                pokemon_link.value = `/pokemon/index.html?name=${pokemon.name}`;
                pokemon_card.setAttributeNode(pokemon_link);
                a.value = `w-36 lg:w-72 h-48 lg:h-90 p-5 rounded-2xl inline-flex flex-col justify-center items-center hover:scale-110 transform-3d transition-transform duration-350 border border-2 hover:border-7 border-black`;

                // Add hover effect dynamically
                pokemon_card.addEventListener('mouseover', () => {
                    pokemon_card.style.borderColor = `var(--color-${pokemon.types[0].type.name})`;
                    pokemon_card.style.backgroundColor = `var(--color-${pokemon.types[0].type.name})`;
                });
                pokemon_card.addEventListener('mouseout', () => {
                    pokemon_card.style.borderColor = 'black';
                    pokemon_card.style.backgroundColor = `white`;
                });

                pokemon_card.setAttributeNode(a);
                const b = document.createAttribute('id');
                b.value = `pokemon-${pokemon.id}`;
                pokemon_card.setAttributeNode(b);

                // Front Card
                const front_card = document.createElement('div');
                const i = document.createAttribute('class');
                i.value = 'backface-hidden flex flex-col justify-center items-center';
                front_card.setAttributeNode(i);

                // Sprite
                const pokemon_sprite = document.createElement('img');
                const c = document.createAttribute('class');
                c.value = 'flex-auto w-full';
                pokemon_sprite.setAttributeNode(c);
                const d = document.createAttribute('id');
                d.value = `pokemon-${pokemon.id}-sprite`;
                pokemon_sprite.setAttributeNode(d);
                pokemon_sprite.src = `${pokemon.spriteUrl}`;

                // Pokemon Name
                const pokemon_name = document.createElement('div');
                const e = document.createAttribute('class');
                e.value = 'text-center justify-center text-black text-2xl lg:text-3xl font-light';
                pokemon_name.setAttributeNode(e);
                const f = document.createAttribute('id');
                f.value = `pokemon-${pokemon.id}-name`;
                pokemon_name.setAttributeNode(f);
                pokemon_name.innerHTML = `${pokemon.name}`;

                // Pokemon Types Container
                const pokemon_types = document.createElement('div');
                const g = document.createAttribute('class');
                g.value = 'w-full lg:px-10 inline-flex justify-center items-center gap-[3px] flex-wrap content-center';
                pokemon_types.setAttributeNode(g);
                const h = document.createAttribute('id');
                h.value = `pokemon-${pokemon.id}-types`;
                pokemon_types.setAttributeNode(h);

                // Pokemon Type
                pokemon.types.forEach((typeObj, index) => {
                    const pokemon_type = document.createElement('div');
                    const a = document.createAttribute('class');
                    a.value = `px-1 py-0 rounded-md flex justify-between items-center text-black text-xs lg:text-sm font-bold font-open-sans`;
                    pokemon_type.style.backgroundColor = typeColors[typeObj.type.name];
                    pokemon_type.setAttributeNode(a);
                    const b = document.createAttribute('id');
                    b.value = `pokemon-${pokemon.id}-type-${index}`;
                    pokemon_type.setAttributeNode(b);
                    pokemon_type.innerHTML = typeObj.type.name;

                    pokemon_types.appendChild(pokemon_type);
                });

                front_card.appendChild(pokemon_sprite);
                front_card.appendChild(pokemon_name);
                front_card.appendChild(pokemon_types);
                pokemon_card.appendChild(front_card);

                // Back Card
                const back_card = document.createElement('div');
                const j = document.createAttribute('class');
                j.value =
                    'backface-hidden flex flex-col justify-center rotate-y-180 absolute top-0 bottom-0 right-0 left-0 p-5';
                back_card.setAttributeNode(j);

                // Create a container for the details
                const detailsContainer = document.createElement('div');

                // Pokemon Weight
                const weight_kg = (pokemon.weight * 0.1).toFixed(2);

                // Pokemon Height
                const height_cm = (pokemon.height * 0.1).toFixed(2);

                // Weight
                const weightTitle = document.createElement('div');
                weightTitle.className = 'text-black text-xl';
                weightTitle.innerText = 'Weight';
                detailsContainer.appendChild(weightTitle);

                const weightValue = document.createElement('div');
                weightValue.className = 'text-center text-black text-md';
                weightValue.innerText = `${weight_kg} kg`;
                detailsContainer.appendChild(weightValue);

                // Height
                const heightTitle = document.createElement('div');
                heightTitle.className = 'text-black text-xl';
                heightTitle.innerText = 'Height';
                detailsContainer.appendChild(heightTitle);

                const heightValue = document.createElement('div');
                heightValue.className = 'text-center text-black text-md';
                heightValue.innerText = `${height_cm} cm`;
                detailsContainer.appendChild(heightValue);

                // HP
                const hpTitle = document.createElement('div');
                hpTitle.className = 'text-black text-xl';
                hpTitle.innerText = 'HP';
                detailsContainer.appendChild(hpTitle);

                const hpValue = document.createElement('div');
                hpValue.className = 'text-center text-black text-md';
                hpValue.innerText = `${pokemon.hp}`;
                detailsContainer.appendChild(hpValue);

                // Append the details container to the desired parent element
                back_card.appendChild(detailsContainer);

                // pokemon_card.appendChild(back_card);
                pokemons.appendChild(pokemon_card);
            });
        }
    })();
}

// Pagination Event Listeners
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('current-page').innerHTML = currentPage;
        renderPokemon(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    document.getElementById('current-page').innerHTML = currentPage;
    renderPokemon(currentPage);
});

renderPokemon(currentPage);
