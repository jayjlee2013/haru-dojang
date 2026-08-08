/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// 한국어판/영어판을 언어 전환 없이 완전히 분리된 두 진입점으로 배포한다 (VITE_LANG=en로 빌드).
// 한국어(기본): /haru-dojang/  영어: /haru-dojang/en/  — 같은 코드, 빌드 시점에 언어 고정.
const IS_EN = process.env.VITE_LANG === 'en'
const GH_PAGES_BASE = IS_EN ? '/haru-dojang/en/' : '/haru-dojang/'
const OUT_DIR = IS_EN ? 'dist/en' : 'dist'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? GH_PAGES_BASE : '/',
  build: { outDir: OUT_DIR },
  // host: true — 같은 와이파이의 다른 기기(폰 등)에서 개발 서버에 접속할 수 있게 한다.
  // 기본값(localhost만 허용)이면 폰에서 열리지 않는다. 프로덕션 빌드에는 영향 없음.
  server: { host: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: IS_EN ? 'Haru Dojang' : '하루도장',
        short_name: IS_EN ? 'Haru Dojang' : '하루도장',
        description: IS_EN
          ? 'A dojang-style habit app: clear one small daily gate at a time.'
          : '하루 하나의 관문을 깨며 수련 일지의 비밀을 열어가는 도장깨기 루틴 앱',
        theme_color: '#D85A30',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: GH_PAGES_BASE,
        scope: GH_PAGES_BASE,
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
}))
