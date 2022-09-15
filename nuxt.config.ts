import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineNuxtConfig({
  build: {
    transpile:
    process.env.NODE_ENV === 'production'
      ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          '@juggle/resize-observer',
        ]
      : ['@juggle/resize-observer'],
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  experimental: {
    reactivityTransform: true,
  },
  colorMode: {
    classSuffix: '',
  },
  vite: {
    plugins: [AutoImport({
      imports: [
        'pinia',
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
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : [],
    },
  },
})
