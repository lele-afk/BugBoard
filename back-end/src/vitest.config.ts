import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'], // 'lcov' genererà la cartella coverage/lcov.info
            include: ['src/**/*'],
            exclude: ['src/db/migrations/**/*'], // Escludi drizzle anche dai test
        },
    },
});