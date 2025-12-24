import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isDocker = process.env.DOCKER === "true";

  return {
    server: {
      open: !isDocker,
      host: isDocker ? '0.0.0.0' : 'localhost',
      base: '/AtmosInsight',
      proxy: {
        '/api': {
          target: isProduction
            ? 'https://aceschedules.onrender.com/api'
            : 'http://backend-dev:1500',
          changeOrigin: true,
        },
      },
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
  };
});
