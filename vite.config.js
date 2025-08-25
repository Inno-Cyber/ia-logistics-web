import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ia-logistics-web/', // ⚠️ 项目页必须这样
})
