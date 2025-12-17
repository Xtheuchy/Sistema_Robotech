import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/registro': 'http://localhost:8080',
      '/competidor': 'http://localhost:8080',
      '/club': 'http://localhost:8080',
      '/robots': 'http://localhost:8080',
      '/torneos': 'http://localhost:8080',
    },
  },
})
