import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import { createVitePlugins } from './build/vite'
import { exclude, include } from './build/vite/optimize'

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(mode),
    server: {
      host: true,
      port: 3200,
      proxy: {
        '/api': {
          target: `https://api.hcenvio.com`, // 代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          ws: false,
        },
        '/wss': {
          target: `wss://api.hcenvio.com/ws`, // 代理接口
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
    },

    optimizeDeps: { include, exclude },
  }
}
