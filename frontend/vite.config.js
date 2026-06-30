import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Mutual-Fund-Performance-Tracker-And-Risk-Analyzer---Project/'
})