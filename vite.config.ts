import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import wyw from '@wyw-in-js/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		wyw(),
		VitePWA({
			registerType: 'prompt',
			includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.svg'],
      manifest: {
        name: 'Nevernote',
        short_name: 'Nevernote',
        description: 'Rich but minimalistic note taking app',
        theme_color: '#1c1c1c',
				background_color: '#1c1c1c',
        icons: [
          {
            src: 'nevernote-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'nevernote-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'nevernote-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
		})
	],
	resolve: {
		alias: { '@': path.resolve(__dirname, './src') }
	}
})
