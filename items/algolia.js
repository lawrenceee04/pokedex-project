// Algolia

import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { algoliasearch } from 'algoliasearch';
import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch('WJXBF270Y9', '44cf84067475f423f671d3aa8768e141');

autocomplete({
    container: '#autocomplete',
    placeholder: 'Search for items',
    getSources({ query }) {
        return [
            {
                sourceId: 'items',
                getItems() {
                    return getAlgoliaResults({
                        searchClient,
                        queries: [
                            {
                                indexName: 'items',
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
                            href="/item/index.html?name=${item.name}"
                            class="h-auto p-4 rounded-xl shadow-md bg-white border border-gray-200 flex flex-row place-content-center items-center gap-2"
                        >
                            <div class="h-full">
                                <img
                                    class="w-20 h-20"
                                    src="${item.sprite}"
                                    alt="${item.name}"
                                    id="item-${item.id}-img"
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
