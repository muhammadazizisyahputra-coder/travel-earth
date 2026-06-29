import { defineConfig } from 'vite'

export default defineConfig({
  // Vercel 根路径部署 → base: '/'
  // 部署后资源路径：https://YOUR_VERCEL_DOMAIN/assets/index-xxx.js
  base: '/'
})
