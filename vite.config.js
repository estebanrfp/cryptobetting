import { VitePWA } from 'vite-plugin-pwa'
import copy from 'rollup-plugin-copy'

export default {
  build: {
    outDir: './dist',
    target: ['es2020'],
    chunkSizeWarningLimit: 8000
  },

  optimizeDeps: {
    esbuildOptions: { target: 'es2021' },
    include: [
      // 'gun',
      // 'gun/gun',
      // 'gun/sea',
      // 'gun/sea.js',
      // 'gun/lib/then',
      // 'gun/lib/webrtc',
      // 'gun/lib/radix',
      // 'gun/lib/radisk',
      // 'gun/lib/store',
      // 'gun/lib/rindexed'
    ],
    exclude: [
      'electron-fetch'
    ]
  },

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: false,
        maximumFileSizeToCacheInBytes: 50000000
      }
    }),
    copy({
      targets: [{ src: './static/*', dest: './dist' }],
      verbose: true,
      hook: 'writeBundle',
      copyOnce: true
    })
  ]
}
