import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'SkillSwap',
        short_name: 'SkillSwap',
        start_url: '/',
        display: 'standalone',
        background_color: '#e91e86',
        theme_color: '#e91e86',
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
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg,webp,ico,woff,woff2}'],
      }
    })
  ],
=======

export default defineConfig({
  plugins: [react()],
>>>>>>> 548b36d6c00c38b3c5310bdcec693d67f8af1a37
  server: {
    port: 5173,
  },
})
