import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    server: {
      proxy: {
        '/api': {
          target: isProduction
            ? 'https://aceschedules.onrender.com'
            : 'http://localhost:1000',
          changeOrigin: true,
        },
      },
      host: 'localhost',
    },
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: '/AtmosInsight/',
  };
});
