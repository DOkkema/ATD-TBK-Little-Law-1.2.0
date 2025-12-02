import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // This is CRITICAL for SharePoint to find the files
  build: {
    outDir: 'dist',
  }
})