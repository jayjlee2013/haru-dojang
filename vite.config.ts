/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // host: true — 같은 와이파이의 다른 기기(폰 등)에서 개발 서버에 접속할 수 있게 한다.
  // 기본값(localhost만 허용)이면 폰에서 열리지 않는다. 프로덕션 빌드에는 영향 없음.
  server: { host: true },
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
