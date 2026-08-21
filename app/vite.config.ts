import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { deckApi } from './server/deck-api.ts'

/**
 * Relative base, so the same build works from a GitHub Pages project path
 * (/snu-tmu-workshop-2026/), from the repository root, and from file://.
 */
export default defineConfig({
  base: './',
  plugins: [react(), deckApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8000,
    strictPort: false,
    open: '/',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1200,
  },
})
