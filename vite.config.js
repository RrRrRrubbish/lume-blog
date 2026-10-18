import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 部署相对基准路径，确保静态资源在任意子路径下均可正常引用
  base: './'
})