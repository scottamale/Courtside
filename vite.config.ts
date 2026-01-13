
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Courtside/', // This must match your GitHub repository name exactly (case-sensitive)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true // Helps debug errors in the console if it crashes
  }
})