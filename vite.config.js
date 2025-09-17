import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // SW her deploy sonrası otomatik günceller
      manifest: {
        name: 'Kişisel Koçluk',
        short_name: 'Koçluk',
        start_url: '/',
        display: 'standalone',
        background_color: '#e3ca0e',
        theme_color: '#403f3c',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'], // cachelenecek dosyalar
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore.googleapis.com\/.*/i,
            handler: 'NetworkFirst', // Firestore API çağrılarını öncelikle networkten al
            options: {
              cacheName: 'firestore-cache'
            }
          }
        ]
      }
    })
  ]
})
