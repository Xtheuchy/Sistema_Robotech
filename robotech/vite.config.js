import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://robotech-backend-v456.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://robotech-backend-v456.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
