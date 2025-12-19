import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import { createVitePlugins } from './build/vite'
import { exclude, include } from './build/vite/optimize'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'


export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(mode),
    mode: env.VITE_USER_NODE_ENV,
    server: {
      host: true,
      port: 3323,
      proxy: {
        '/capi': {
          target: `https://zj.crossbordershopping.one/app-api`, // 代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/capi/, ''),
          ws: false,
        },
        '/wss': {
          target: `wss://zj.crossbordershopping.one/ws`, // 代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/wss/, ''),
          ws: true,
        },

      },
    },

    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        '~root': path.join(__dirname, '.'),
      },
    },

    build: {
      cssCodeSplit: false,
      // chunkSizeWarningLimit: 4048,
      outDir: env.VITE_APP_OUT_DIR || 'dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        reeshake: 'safest',  // 或 'safest' 以强制优化
      }
    },

    optimizeDeps: { include, exclude },
  }
}
