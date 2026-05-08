import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/stockflow-react/',

  build: {
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('chart.js')) return 'chart';
        if (id.includes('xlsx')) return 'xlsx';
      }
    }
  }
},

  server: {
    port: 3000,
    open: true,
    cors: true
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})