import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Solo proxy para rutas de API (todas empiezan con /api o /auth)
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
    },
  },
})
