// Algolia

import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { algoliasearch } from 'algoliasearch';
import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch('WJXBF270Y9', '44cf84067475f423f671d3aa8768e141');

autocomplete({
    container: '#autocomplete',
    placeholder: 'Search for pokemons',
    getSources({ query }) {
        return [
            {
                sourceId: 'pokemons',
                getItems() {
                    return getAlgoliaResults({
                        searchClient,
                        queries: [
                            {
                                indexName: 'pokemons',
                                params: {
                                    query,
                                    hitsPerPage: 5,
                                },
                            },
                        ],
                    });
                },
                templates: {
                    item({ item, components, html }) {
                        return html`<a
                            href="${item.name}"
                            class="h-auto p-4 rounded-xl shadow-md bg-white border border-gray-200 flex flex-row place-content-center items-center gap-2"
                        >
                            <div class="h-full">
                                <img
                                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png"
                                    alt="${item.name}"
                                    id="pokemon-${item.id}-img"
                                />
                            </div>
                            <div class="text-xl font-bold text-gray-900">${item.name}</div>
                        </a> `;
                    },
                },
                // ...
            },
        ];
    },
});
