import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true, // Đảm bảo Vite không đổi sang cổng khác
    cors: true,
  }
});

