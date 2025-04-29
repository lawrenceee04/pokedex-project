import { Spinner } from 'spin.js';
const url = 'https://pokeapi.co/api/v2/';

// Spinner brought to you by https://spin.js.org/
var opts = {
    lines: 13, // The number of lines to draw
    length: 11, // The length of each line
    width: 16, // The line thickness
    radius: 33, // The radius of the inner circle
    scale: 1.35, // Scales overall size of the spinner
    corners: 0.7, // Corner roundness (0..1)
    speed: 1.4, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-shrink', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#faf200', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 5px black', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'absolute', // Element positioning
};

export async function fetchAPI(endpoint, offset = 0, limit = 0) {
    var target = document.querySelector('.spinner');
    var spinner = new Spinner(opts).spin(target);
    target.classList.add('bg-black/80', 'z-999');

    try {
        let response = undefined;
        if (offset == 0 && limit == 0) {
            response = await fetch(`${url}${endpoint}`);
        } else {
            response = await fetch(`${url}${endpoint}/?offset=${offset}&limit=${limit}`);
        }

        const results = response.json();

        spinner.stop();
        target.classList.remove('bg-black/80', 'z-999');

        return results;
    } catch (error) {
        return 1;
    }
}

export async function fetchSearchAPI(endpoint, id) {
    var target = document.querySelector('.spinner');
    var spinner = new Spinner(opts).spin(target);
    target.classList.add('bg-black/80', 'z-999');

    try {
        const response = await fetch(`${url}${endpoint}/${id}`);
        const results = await response.json();

        return results;
    } catch (error) {
        console.error('Error fetching search API:', error);
        return null;
    } finally {
        spinner.stop();
        target.classList.remove('bg-black/80', 'z-999');
    }
}
