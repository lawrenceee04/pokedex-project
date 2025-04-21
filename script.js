const pokeAPI = 'https://pokeapi.co/api/v2/';
const pokemon = `${pokeAPI}pokemon/`;
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
    try {
        const response = await fetch(`${pokemon}?offset=${offset}&limit=${limit}`);
        const json0 = await response.json();
        const json = json0.results;
        return json;
    } catch (error) {
        return 1;
    }
}

async function renderPokemon(page) {
    const pokemons = document.getElementById('pokemons');
    pokemons.innerHTML = '';
    (async () => {
        const result = await getPokemons(page);
        if (result === 1) {
            console.log('error');
        } else {
            const pokemonDetails = await Promise.all(
                result.map(async (element) => {
                    const pokemon = await getPokemonByUrl(element.url);
                    const id = pokemon.id;
                    const spriteUrl = pokemon.sprites.front_default;
                    const types = pokemon.types;
                    const name = element.name;
                    const weight = pokemon.weight;
                    const height = pokemon.height;

                    return { id, name, spriteUrl, types, weight, height };
                })
            );
            pokemonDetails.forEach(({ id, name, spriteUrl, types, weight, height }) => {
                // Pokemon Card
                const pokemon_card = document.createElement('div');
                const a = document.createAttribute('class');
                a.value =
                    'w-36 lg:w-72 h-48 lg:h-72 p-5 rounded-2xl outline inline-flex flex-col justify-center items-center hover:rotate-y-180 transform-3d transition-transform duration-350';
                pokemon_card.setAttributeNode(a);
                const b = document.createAttribute('id');
                b.value = `pokemon-${id}`;
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
                d.value = `pokemon-${id}-sprite`;
                pokemon_sprite.setAttributeNode(c);
                pokemon_sprite.src = `${spriteUrl}`;

                // Pokemon Name
                const pokemon_name = document.createElement('div');
                const e = document.createAttribute('class');
                e.value = 'text-center justify-center text-black text-2xl lg:text-3xl font-light';
                pokemon_name.setAttributeNode(e);
                const f = document.createAttribute('id');
                f.value = `pokemon-${id}-name`;
                pokemon_name.setAttributeNode(f);
                pokemon_name.innerHTML = `${name}`;

                // Pokemon Types Container
                const pokemon_types = document.createElement('div');
                const g = document.createAttribute('class');
                g.value = 'w-full lg:px-10 inline-flex justify-center items-center gap-[3px] flex-wrap content-center';
                pokemon_types.setAttributeNode(g);
                const h = document.createAttribute('id');
                h.value = `pokemon-${id}-types`;
                pokemon_types.setAttributeNode(h);

                // Pokemon Type
                types.forEach((typeObj, index) => {
                    const pokemon_type = document.createElement('div');
                    const a = document.createAttribute('class');
                    a.value = `px-1 py-0 rounded-lg flex justify-between items-center text-black text-xs lg:text-sm font-semibold`;
                    pokemon_type.style.backgroundColor = typeColors[typeObj.type.name];
                    pokemon_type.setAttributeNode(a);
                    const b = document.createAttribute('id');
                    b.value = `pokemon-${id}-type-${index}`;
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
                const heightInFeet = Math.floor(height * 0.328084); // Convert decimeters to feet
                const heightInInches = Math.round((height * 0.328084 - heightInFeet) * 12); // Remaining inches
                const height_foot = `${heightInFeet}`;
                const height_inch = heightInInches < 10 ? `0${heightInInches}` : `${heightInInches}`;

                // Pokemon Weight
                const weight_kg = weight * 0.1;

                back_card.innerHTML = `${height_foot[0]}' ${height_inch}" ${weight_kg} kg`;

                pokemon_card.appendChild(back_card);
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
