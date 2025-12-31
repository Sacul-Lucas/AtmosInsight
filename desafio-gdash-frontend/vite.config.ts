import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig(() => {
  const isDocker = process.env.DOCKER === "true";

  return {
    server: {
      open: !isDocker,
      host: isDocker ? '0.0.0.0' : 'localhost',
      base: '/AtmosInsight',
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:1500',
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
