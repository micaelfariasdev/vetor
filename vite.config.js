import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://vetor-api.micaelfarias.com',
        changeOrigin: true,
        secure: true,
        ws: true,
      },
      '/apiv2/': {
        target: 'https://vetor.micaelfarias.com',
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
})
