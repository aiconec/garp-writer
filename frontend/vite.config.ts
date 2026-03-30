import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { getLocalFrappeUIDevConfig, importFrappeUIPlugin } from './vite-helpers'

export default defineConfig(async ({ mode }) => {
  const { useLocalFrappeUI, localFrappeUIAliases } = getLocalFrappeUIDevConfig({
    mode,
    rootDir: __dirname,
  })

  const frappeui = await importFrappeUIPlugin({ useLocalFrappeUI })

  const config = {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
    plugins: [
      frappeui({
        frappeProxy: true,
        lucideIcons: true,
        jinjaBootData: true,
        buildConfig: {
          indexHtmlPath: '../writer/www/writer.html',
        },
      }),
      AutoImport({
        include: [/\.vue$/, /\.vue\?vue/],
        imports: ['vue', 'vue-router'],
      }),
      vue(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
        ...localFrappeUIAliases,
      },
      dedupe: [
        'yjs',
        'prosemirror-state',
        'prosemirror-view',
        'prosemirror-model',
        'prosemirror-transform',
      ],
    },
    build: {
      sourcemap: true,
      outDir: `../${path.basename(path.resolve('..'))}/public/frontend`,
      emptyOutDir: true,
      target: 'esnext',
      commonjsOptions: {
        include: [/tailwind.config.js/, /node_modules/],
      },
    },
    server: {
      allowedHosts: ['drive.localhost'],
      fs: {
        allow: ['..'],
      },
    },
    optimizeDeps: {
      include: ['yjs',  'prosemirror-tables',
        'prosemirror-gapcursor'],
    },
  }
  return config
})
