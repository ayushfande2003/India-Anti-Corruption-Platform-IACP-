import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'India Anti-Corruption Platform',
      short_name: 'IACP',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0ea5e9',
      icons: []
    }
  })],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
})