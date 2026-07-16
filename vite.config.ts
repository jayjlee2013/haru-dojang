/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '하루도장',
        short_name: '하루도장',
        description: '하루 하나의 관문을 깨며 수련 일지의 비밀을 열어가는 도장깨기 루틴 앱',
        theme_color: '#D85A30',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: ['src/domain/**/*.ts'],
      exclude: ['src/domain/**/__tests__/**', 'src/domain/types.ts']
    }
  }
})
