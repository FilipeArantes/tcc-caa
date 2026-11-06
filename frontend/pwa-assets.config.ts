import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

const AZUL_DO_ICONE = '#005fcc'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, padding: 0.1, resizeOptions: { background: AZUL_DO_ICONE } },
    apple: { ...minimal2023Preset.apple, padding: 0.1, resizeOptions: { background: AZUL_DO_ICONE } },
  },
  images: ['public/icone.svg'],
})
