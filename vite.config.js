import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                pokemons: resolve(__dirname, 'pokemons/index.html'),
                abilities: resolve(__dirname, 'abilities/index.html'),
                locations: resolve(__dirname, 'locations/index.html'),
            },
        },
    },
});
