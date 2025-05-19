import 'flowbite';
import NodeCache from '@cacheable/node-cache';
import { fetchAPI } from '../pokeapi.js';

const cache = new NodeCache();
const limit = 20;
let currentPage = 1;

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

async function getItemByUrl(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        return 1;
    }
}

async function getItems(page = 1) {
    const offset = (page - 1) * limit;

    // Set cache key to page/${pageNumber}
    const key = `page/${page}`;
    if (cache.get(key)) {
        return cache.get(key);
    } else {
        const response = await fetchAPI('item', offset, limit);
        const results = response.results;
        cache.set(key, results, 0);
        return results;
    }
}

async function getItem(url) {
    const response = await fetch(url);
    const result = await response.json();
    return result;
}

async function renderItem(page) {
    const Items = document.getElementById('items-list');
    Items.innerHTML = '';
    (async () => {
        const results = await getItems(page);
        if (results === 1) {
            console.log('error');
        } else {
            // Make sure all Item details are pulled before DOM manipulation
            const itemDetails = await Promise.all(
                results.map(async (result) => {
                    const response = await getItem(result.url);
                    return {
                        id: `${response.id}`,
                        apiFriendlyName: `${response.name}`,
                        name: `${response.names[7].name}`,
                        sprite: `${response.sprites.default}`,
                        category: `${response.category.name}`,
                    };
                })
            );
            itemDetails.forEach((item) => {
                // Card
                const card = document.createElement('a');
                const a = document.createAttribute('class');
                const link = document.createAttribute('href');
                link.value = `/item/index.html?name=${item.apiFriendlyName}`;
                card.setAttributeNode(link);
                a.value = `w-36 lg:w-72 h-48 lg:h-72 p-5 rounded-2xl inline-flex flex-col justify-center items-center hover:scale-110 transform-3d transition-transform duration-350 border border-2 border-black`;

                card.setAttributeNode(a);
                const b = document.createAttribute('id');
                b.value = `item-${item.id}`;
                card.setAttributeNode(b);

                // Front Card
                const front_card = document.createElement('div');
                const i = document.createAttribute('class');
                i.value = 'backface-hidden flex flex-col justify-center items-center';
                front_card.setAttributeNode(i);

                // Sprite
                const sprite = document.createElement('img');
                const c = document.createAttribute('class');
                c.value = 'flex-auto w-full';
                sprite.setAttributeNode(c);
                const d = document.createAttribute('id');
                d.value = `item-${item.id}-sprite`;
                sprite.setAttributeNode(d);
                sprite.src = `${item.sprite}`;

                // Name
                const item_name = document.createElement('div');
                const e = document.createAttribute('class');
                e.value = 'text-center justify-center text-black text-2xl lg:text-3xl font-light';
                item_name.setAttributeNode(e);
                const f = document.createAttribute('id');
                f.value = `item-${item.id}-name`;
                item_name.setAttributeNode(f);
                item_name.innerHTML = `${item.name}`;

                // Category
                const category = document.createElement('div');
                const h = document.createAttribute('class');
                h.value = `px-1 py-0 rounded-md flex justify-between items-center text-xs lg:text-sm font-bold font-open-sans`;
                // Normalize category key for color lookup
                const colorKey = item.category.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
                const bgColor = categoryColors[colorKey] || '#E0E0E0';
                category.style.backgroundColor = bgColor;
                category.style.color = getContrastYIQ(bgColor);
                category.setAttributeNode(h);
                const j = document.createAttribute('id');
                j.value = `item-${item.id}-category`;
                category.setAttributeNode(j);
                category.innerHTML = `${item.category.replace('-', ' ')}`;

                front_card.appendChild(sprite);
                front_card.appendChild(item_name);
                front_card.appendChild(category);
                card.appendChild(front_card);
                Items.appendChild(card);
            });
        }
    })();
}

// Pagination Event Listeners
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('current-page').innerHTML = currentPage;
        renderItem(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    document.getElementById('current-page').innerHTML = currentPage;
    renderItem(currentPage);
});

renderItem(currentPage);
