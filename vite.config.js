
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Juguetería Mágica',
        short_name: 'Juguetería',
        description: 'Administración de una tienda de juguetes',
        theme_color: '#7c5ce7',
        background_color: '#fffaf4',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/toy-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/toy-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
