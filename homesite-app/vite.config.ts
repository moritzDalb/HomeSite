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
    // Basis-Pfad nur für Production-Build (Tomcat-Deployment)
    base: command === 'build' ? '/homesite/' : '/',
    build: {
        outDir: 'dist',
    },
}));
