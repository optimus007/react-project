import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './docs/',
    chunkSizeWarningLimit: 1000,
    
  },
  base: './'
})

