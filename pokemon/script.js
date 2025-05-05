import 'flowbite';
import { fetchSearchAPI } from '../pokeapi.js';
import * as d3 from 'd3';

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

const typeGradients = {
    normal: 'linear-gradient(135deg, #A8A77A 0%, #C6C6A7 25%, #8D8D7A 50%, #6D6D4E 100%)',
    grass: 'linear-gradient(135deg, #7AC74C 0%, #A8E6A3 25%, #5DAE3E 50%, #3E7D20 100%)',
    bug: 'linear-gradient(135deg, #A6B91A 0%, #D8E170 25%, #8A9C14 50%, #6E7F0E 100%)',
    poison: 'linear-gradient(135deg, #A33EA1 0%, #D47AD3 25%, #822F82 50%, #5E205E 100%)',
    fire: 'linear-gradient(135deg, #EE8130 0%, #FFB380 25%, #CC5C00 50%, #993F00 100%)',
    water: 'linear-gradient(135deg, #6390F0 0%, #A0C4FF 25%, #4A74C2 50%, #2F4A80 100%)',
    electric: 'linear-gradient(135deg, #F7D02C 0%, #FFF07C 25%, #D1B328 50%, #A58C1F 100%)',
    psychic: 'linear-gradient(135deg, #F95587 0%, #FFA0B9 25%, #C74066 50%, #8F2A46 100%)',
    fighting: 'linear-gradient(135deg, #C22E28 0%, #E57373 25%, #9E2320 50%, #661814 100%)',
    ground: 'linear-gradient(135deg, #E2BF65 0%, #F4E3A1 25%, #C2A250 50%, #8A7237 100%)',
    rock: 'linear-gradient(135deg, #B6A136 0%, #E0D070 25%, #97852D 50%, #6E5E20 100%)',
    flying: 'linear-gradient(135deg, #A98FF3 0%, #D2C4F7 25%, #7F6DC0 50%, #55488C 100%)',
    ice: 'linear-gradient(135deg, #96D9D6 0%, #C9F3F2 25%, #72B5B3 50%, #4C8583 100%)',
    dark: 'linear-gradient(135deg, #705746 0%, #A48C7C 25%, #574335 50%, #3E2E24 100%)',
    ghost: 'linear-gradient(135deg, #735797 0%, #B19FC8 25%, #5A4576 50%, #3F2E54 100%)',
    dragon: 'linear-gradient(135deg, #6F35FC 0%, #A18CFF 25%, #5930C7 50%, #3F2390 100%)',
    fairy: 'linear-gradient(135deg, #D685AD 0%, #F0B8D3 25%, #B46991 50%, #8A4A6B 100%)',
    steel: 'linear-gradient(135deg, #B7B7CE 0%, #D9D9E7 25%, #9292A6 50%, #6E6E7F 100%)',
    metal: 'linear-gradient(135deg, #B8B8D0 0%, #DADAE5 25%, #9494A8 50%, #6B6B7F 100%)',
};

const typeTextColors = {
    normal: '#2E2E2E', // Dark grey, good over light normal tones
    grass: '#ffffff', // White contrasts the greens
    bug: '#ffffff', // White contrasts yellow-greens
    poison: '#ffffff', // White contrasts purple
    fire: '#ffffff', // White over oranges
    water: '#ffffff', // White over blues
    electric: '#2E2E2E', // Dark text over bright yellow
    psychic: '#ffffff', // White over pink-reds
    fighting: '#ffffff', // White over dark reds
    ground: '#2E2E2E', // Dark text over tan
    rock: '#2E2E2E', // Dark text over sandy yellow
    flying: '#ffffff', // White over light purple-blue
    ice: '#2E2E2E', // Dark text over aqua
    dark: '#ffffff', // White over dark browns
    ghost: '#ffffff', // White over purples
    dragon: '#ffffff', // White over dark purple-blue
    fairy: '#2E2E2E', // Dark text over pinks
    steel: '#2E2E2E', // Dark over steel gray
    metal: '#2E2E2E', // Same as steel
};

const pokemon = window.location.search.split('=')[1];
document.title = `Pokemon | ${pokemon}`;

async function renderPokemonDetails() {
    const response = await fetchSearchAPI('pokemon', `${pokemon}`);
    console.log(response);

    const body = document.querySelector('.spinner');
    const pokemonContainer = document.getElementById('pokemon');

    body.style.background = typeGradients[response.types[0].type.name];
    body.style.color = typeTextColors[response.types[0].type.name];
    body.style.textShadow =
        typeTextColors[response.types[0].type.name] === '#2E2E2E'
            ? '2px 2px 4px rgba(255, 255, 255, 0.5)'
            : '2px 2px 4px rgba(0, 0, 0, 0.5)';

    // Pokemon Sprite
    const pokemonSprite = document.createElement('img');
    pokemonSprite.id = `${pokemon}-sprite`;
    pokemonSprite.classList.add('w-64', 'lg:w-128');
    pokemonSprite.src = `${response.sprites.front_default}`;

    // Stats Container
    const name_stats = document.createElement('div');
    name_stats.classList.add('flex', 'flex-col', 'gap-4');

    // Pokemon Name
    const pokemonName = document.createElement('div');
    pokemonName.id = `${response.name}`;
    pokemonName.classList.add(`text-4xl`);
    pokemonName.innerHTML = `${response.name}`;

    // Pokemon Stats
    const pokemonStats = document.createElement('div');
    pokemonStats.id = `${pokemon}-stats`;
    pokemonStats.classList.add('w-50');

    const pokemonHp = createPokemonStatElement(response, 'hp', response.stats[0].base_stat);
    const pokemonAtk = createPokemonStatElement(response, 'attack', response.stats[1].base_stat);

    // Append Those Children :) HAHAHAHA

    pokemonContainer.appendChild(pokemonSprite);
    name_stats.appendChild(pokemonName);
    name_stats.appendChild(pokemonHp);
    name_stats.appendChild(pokemonAtk);
    pokemonContainer.appendChild(name_stats);
}

function createPokemonStatElement(response, statName, baseStat) {
    // Stat Container
    const pokemonStat = document.createElement('div');
    pokemonStat.id = `${response.name}-stats-${statName}`;
    pokemonStat.classList.add('w-50', 'flex', 'flex-col', 'flex-cols-2', 'sm:flex-cols-3');

    // Stat - Name Only
    const pokemonStatName = document.createElement('div');
    pokemonStatName.id = `${response.name}-${statName}`;
    pokemonStatName.classList.add('text-md');
    pokemonStatName.innerHTML = `${statName.toUpperCase()}`;

    pokemonStat.appendChild(pokemonStatName);

    // Stat - Radial
    const pokemonStatRadial = document.createElement('div');
    pokemonStatRadial.id = `${response.name}-${statName}-radial`;
    pokemonStatRadial.classList.add('h-20', 'w-20');
    pokemonStatRadial.style.filter = 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))'; // Add subtle dark drop shadow
    pokemonStat.appendChild(pokemonStatRadial);

    const statInPercentage = baseStat / 255;
    pokemonStatRadial.appendChild(renderCircularBar(statInPercentage, response.types[0].type.name));

    return pokemonStat;
}

function renderCircularBar(data, type) {
    const width = 10;
    const height = 10;
    const outerRadius = height * 0.5;
    const innerRadius = outerRadius * 0.6;

    const tau = 2 * Math.PI;

    const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);
    const k = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(0);

    // Background Arc
    k.append('path').datum({ endAngle: tau }).style('fill', '#ddd').attr('d', arc);

    // Foreground Arc
    k.append('path')
        .datum({ endAngle: data * tau })
        .style('fill', 'red')
        .attr('d', arc);

    // Text in the middle
    k.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '2px')
        .style('fill', typeTextColors[type])
        .text(Math.round(data * 255));

    return svg.node();
}

renderPokemonDetails();
