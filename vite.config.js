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
    
    // Compression settings
    rollupOptions: {
      output: {
        compact: true,
        manualChunks: {
          // 3D
          'three-libs': ['three'],
          'globe-libs': ['react-globe.gl'],
          'force-graph-libs': ['react-force-graph'],
          'aframe-libs': ['aframe', 'aframe-extras', 'aframe-forcegraph-component'],
          
          // Audio/Visualization
          'audio-libs': ['tone', 'butterchurn', 'butterchurn-presets'],
          
          // UI
          'ui-libs': ['react-icons', 'react-intersection-observer', 'uuid'],
          
          // Utils
          'utils': ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    
    // Remove console logs in production
    esbuild: {
      drop: ['console', 'debugger'],
    },
    
    chunkSizeWarningLimit: 1000,
    
    // Performance optimizations
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    reportCompressedSize: false, // Faster builds
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,jsx,ts,tsx}']
  }
})
