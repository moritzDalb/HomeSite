import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    // Base path only for production build (Tomcat deployment)
    base: command === 'build' ? '/homesite/' : '/',
    build: {
        outDir: 'dist',
    },
}));
