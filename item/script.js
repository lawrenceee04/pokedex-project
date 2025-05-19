import 'flowbite';
import { fetchSearchAPI } from '../pokeapi.js';

const item = window.location.search.split('=')[1];
document.title = `Item | ${item.replace('-', ' ')}`;

const categoryColors = {
    medicine: '#F5A623', // orange
    berry: '#7AC74C', // green
    'key-item': '#A4A4A4', // gray
    pokeball: '#E3350D', // red
    machine: '#B7B7CE', // lavender
    mail: '#F7D02C', // yellow
    'battle-item': '#F95587', // pink
    'held-item': '#A98FF3', // purple
    evolution: '#FFB6C1', // light pink
    'type-enhancement': '#B6A136', // olive
    'stat-boosts': '#A8A77A', // beige
    'effort-drop': '#705746', // brown
    loot: '#8FBC8F', // dark sea green
    contest: '#FF69B4', // hot pink
    'species-specific': '#4682B4', // steel blue
    'all-mail': '#FFE4B5', // moccasin
    'plot-advancement': '#D2691E', // chocolate
    'apricorn-balls': '#32CD32', // lime green
    'special-balls': '#1E90FF', // dodger blue
    'standard-balls': '#DC143C', // crimson
    'evolution-others': '#FFDAB9', // peach puff
    other: '#E0E0E0', // light gray
    // Add more categories as needed
};

// Helper to determine contrast text color (black or white)
function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    if (hexcolor.length === 3) {
        hexcolor = hexcolor[0] + hexcolor[0] + hexcolor[1] + hexcolor[1] + hexcolor[2] + hexcolor[2];
    }
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
}

async function renderItemDetails() {
    const response = await fetchSearchAPI('item', `${item}`);

    const name = document.getElementById('name');
    name.innerHTML = `${response.name.replace('-', ' ')}`;

    const category = document.getElementById('category');
    const colorKey = response.category.name.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
    const bgColor = categoryColors[colorKey] || '#E0E0E0';
    category.style.backgroundColor = bgColor;
    category.style.color = getContrastYIQ(bgColor);
    const j = document.createAttribute('id');
    j.value = `item-${response.id}-category`;
    category.setAttributeNode(j);
    category.innerHTML = `${response.category.name.replace('-', ' ')}`;

    const effect = document.getElementById('effect');
    effect.innerHTML = `${response.effect_entries[0].effect}`;

    const short_effect = document.getElementById('short-effect');
    short_effect.innerHTML = `${response.effect_entries[0].short_effect}`;

    const sprite = document.getElementById('sprite');
    sprite.src = `${response.sprites.default}`;
}

renderItemDetails();
