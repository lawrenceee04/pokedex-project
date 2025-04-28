import 'flowbite';
import { fetchAPI, fetchSearchAPI } from '../pokeapi.mjs';

const searchTerm = window.location.search.split('=')[1];

async function displayPokemonResults(searchTerm) {
    try {
        const response = await fetchSearchAPI('pokemon', searchTerm);

        if (!response) {
            console.error('Failed to fetch search results.');
            return;
        }

        console.log(response);
    } catch (error) {
        console.error('Error displaying Pokemon results:', error);
    }
}

displayPokemonResults(searchTerm);
