import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                pokemon: resolve(__dirname, 'pokemon/index.html'),
                pokemons: resolve(__dirname, 'pokemons/index.html'),
                items: resolve(__dirname, 'items/index.html'),
                item: resolve(__dirname, 'item/index.html'),
            },
        },
    },
});
