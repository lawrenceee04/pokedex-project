import 'flowbite';
import NodeCache from '@cacheable/node-cache';
import { fetchAPI } from '../pokeapi.js';

const cache = new NodeCache();
const limit = 20;
let currentPage = 1;

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
                        name: `${response.names[7].name}`,
                        sprite: `${response.sprites.default}`,
                    };
                })
            );
            itemDetails.forEach((item) => {
                // Pokemon Card
                const card = document.createElement('a');
                const a = document.createAttribute('class');
                const link = document.createAttribute('href');
                link.value = `/item/index.html?name=${item.name}`;
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

                // Pokemon Name
                const item_name = document.createElement('div');
                const e = document.createAttribute('class');
                e.value = 'text-center justify-center text-black text-2xl lg:text-3xl font-light';
                item_name.setAttributeNode(e);
                const f = document.createAttribute('id');
                f.value = `item-${item.id}-name`;
                item_name.setAttributeNode(f);
                item_name.innerHTML = `${item.name}`;

                front_card.appendChild(sprite);
                front_card.appendChild(item_name);
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
