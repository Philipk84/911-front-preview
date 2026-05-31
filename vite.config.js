import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: env.VITE_APP_BASE_PATH || '/iaslab/compu2/911/',
    server: {
      port: 5173,
      open: true
    }
  }
})
