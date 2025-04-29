import 'flowbite';
import { fetchAPI, fetchSearchAPI } from '../pokeapi.js';

const searchTerm = window.location.search.split('=')[1];
const searchResults = document.getElementById('search-results');

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

async function displayPokemonResults(searchTerm) {
    try {
        const response = await fetchSearchAPI('pokemon', searchTerm);

        if (!response) {
            // console.error('Failed to fetch search results.');
            const div = document.createElement('div');
            div.classList.add('font-bold', 'text-red-500', 'text-3xl', 'text-center');
            searchResults.classList.remove('content-start');
            searchResults.classList.add('content-center');
            div.innerHTML = 'No pokemon found';

            searchResults.appendChild(div);
            return;
        } else {
            const pokemon = await response;
            // Pokemon Card
            const pokemon_card = document.createElement('div');
            const a = document.createAttribute('class');
            a.value =
                'w-36 lg:w-72 h-48 lg:h-72 p-5 rounded-2xl outline inline-flex flex-col justify-center items-center hover:rotate-y-180 transform-3d transition-transform duration-350';
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
            pokemon_sprite.setAttributeNode(c);
            pokemon_sprite.src = `${pokemon.sprites.front_default}`;

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
                a.value = `px-1 py-0 rounded-lg flex justify-between items-center text-black text-xs lg:text-sm font-semibold`;
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
                'backface-hidden flex flex-col justify-center items-center rotate-y-180 absolute top-0 bottom-0 right-0 left-0 p-5';
            back_card.setAttributeNode(j);

            // Pokemon Height
            const height_cm = (pokemon.height * 10).toFixed(2);

            // Pokemon Weight
            const weight_kg = (pokemon.weight * 0.1).toFixed(2);

            back_card.innerHTML = `${height_cm} cm ${weight_kg} kg`;

            pokemon_card.appendChild(back_card);
            searchResults.appendChild(pokemon_card);
        }
    } catch (error) {
        console.error('Error displaying Pokemon results:', error);
    }
}

function init() {
    document.getElementById('search').value = searchTerm;
    displayPokemonResults(searchTerm);
}

init();
