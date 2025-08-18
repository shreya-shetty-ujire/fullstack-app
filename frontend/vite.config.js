import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // makes it accessible from host machine / containers
    port: 3000,
  },
  // For React Router
  build: {
    outDir: 'dist',
  },
  base: '/',
})
