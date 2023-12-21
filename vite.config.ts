import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  // 修改完 vite.config 之后，需要重启服务
  plugins: [vue({
    reactivityTransform:true,
  })]
})
