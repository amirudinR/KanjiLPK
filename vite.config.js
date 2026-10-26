import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // PDF sumber data (5 MB) dikunci oleh Windows sehingga watcher Vite crash
  // dengan EBUSY. Tidak pernah diimpor app, jadi jangan di-watch.
  server: {
    watch: { ignored: ['**/*.pdf'] },
  },
  plugins: [
    react(),
    VitePWA({
      // Auto-update: service worker baru langsung aktif (diam-diam).
      registerType: 'autoUpdate',
      // Daftarkan SW otomatis tanpa perlu kode manual.
      injectRegister: 'auto',
      // Aktif di dev supaya bisa diuji offline tanpa build.
      devOptions: { enabled: false },
      // Aset di `public/` yang harus masuk cache app shell.
      includeAssets: [
        'favicon.svg',
        'favicon-32.png',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'Kanji Notebook — Hafalan Kanji JFT',
        short_name: 'Kanji Notebook',
        description:
          'Buku catatan hafalan kanji JFT: flashcard, kuis, game, dan progres belajar — bisa dipakai offline.',
        lang: 'id',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f6f1e3',
        theme_color: '#f6f1e3',
        categories: ['education', 'productivity'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        // Cache semua aset hasil build (JS/CSS/HTML/ikon).
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        // Jangan tunggu interaksi: versi baru langsung ambil alih.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Navigasi SPA: selalu layani index.html (mode offline).
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/],
        runtimeCaching: [
          {
            // Google Fonts (CSS) — cache dulu, perbarui di background.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // File font Google (woff2) — cache jangka panjang.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
})
