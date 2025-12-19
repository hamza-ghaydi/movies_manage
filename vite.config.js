import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom plugin to exclude api directory from Vite processing
const excludeApiPlugin = () => {
  return {
    name: 'exclude-api',
    enforce: 'pre',
    resolveId(id) {
      // Ignore any imports from the api directory
      if (id.includes('/api/') || id.startsWith('./api/') || id.startsWith('../api/')) {
        return { id, external: true }
      }
      return null
    },
    load(id) {
      // Prevent Vite from loading files in the api directory
      if (id.includes('/api/') && !id.includes('node_modules')) {
        return ''
      }
      return null
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), excludeApiPlugin()],
  // Exclude API directory and server-only packages from client bundle
  build: {
    rollupOptions: {
      external: ['pg'], // Exclude pg from client bundle
    }
  },
  // Optimize dependencies to exclude server-only packages
  optimizeDeps: {
    exclude: ['pg']
  }
})
