import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import 'flowbite';

import { fetchAPI } from './pokeapi.js';

function swiperNoSwipingHAHAHA() {
    const swiper = new Swiper('.swiper', {
        freeMode: {
            enabled: true,
            sticky: true,
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 30,
            modifier: 3,
        },
        slidesPerView: 1,
        spaceBetween: 40,
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
    });
}

const minimumIdPokemon = 1;
const maximumIdPokemon = 1025;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function choosePokemonCarousel(min, max) {
    const swiper_wrapper = document.querySelector('.swiper-wrapper');

    for (let i = 0; i < 10; i++) {
        const randomInt = getRandomInt(min, max);
        const result = await fetchAPI(`pokemon/${randomInt}`);

        const slide = document.createElement('div');
        slide.classList.add(
            'swiper-slide',
            'flex',
            'justify-items-center',
            'place-content-center',
            'h-full',
            'relative'
        );

        slide.innerHTML = `<img
        class="h-full sm:h-3/4 brightness-60"
                            src="${result.sprites.front_default}"
                            alt="" />`;

        swiper_wrapper.appendChild(slide);
    }
    swiperNoSwipingHAHAHA();
}

choosePokemonCarousel(minimumIdPokemon, maximumIdPokemon);
