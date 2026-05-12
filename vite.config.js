import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://43.202.250.16:8080',
        changeOrigin: true,
      },
    },
  },
})
