import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineNuxtConfig({
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? ['naive-ui', 'vueuc']
        : [],
  },
  colorMode: {
    classSuffix: '',
  },
  experimental: {
    reactivityTransform: true,
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
  ],
  runtimeConfig: {
    mongodbUri: '',
  },
  vite: {
    plugins: [AutoImport({
      imports: [
        {
          'naive-ui': [
            'useDialog',
            'useLoadingBar',
            'useMessage',
            'useNotification',
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    ],
  },
})
