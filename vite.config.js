import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/stockflow-react/',
  
  // Performance and output optimization
  build: {
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
       manualChunks: (id) => {
  if (id.includes('chart.js')) return 'chart';
  if (id.includes('xlsx')) return 'xlsx';
}
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
