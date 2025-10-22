import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Enable tree shaking
    minify: 'esbuild',
    target: 'esnext',
    cssCodeSplit: true, 
    
    // Compression settings
    rollupOptions: {
      output: {
        compact: true,
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['daisyui'],
          'audio': ['butterchurn', 'butterchurn-presets'],
        }
      }
    },
    
    // Remove console logs in production
    esbuild: {
      drop: ['console', 'debugger'],
    },
    
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,jsx,ts,tsx}']
  }
})
