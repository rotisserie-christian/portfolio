import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssCodeSplit: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        compact: true,
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Heavy library chunks
            if (id.includes('tone')) {
              return 'tone-vendor';
            }
            if (id.includes('butterchurn')) {
              return 'butterchurn-vendor';
            }
            if (id.includes('three')) {
              return 'three-vendor';
            }
            if (id.includes('daisyui') || id.includes('tailwindcss')) {
              return 'ui-vendor';
            }
          }
        },
        // Put CSS files in assets/css/ subdirectory
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || '';
          if (fileName.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-utils/setup.js'],
    include: ['src/**/*.test.{js,jsx,ts,tsx}']
  }
})
