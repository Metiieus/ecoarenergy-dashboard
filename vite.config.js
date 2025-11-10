import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5175'),
  },
  plugins: [react(), tailwindcss()],
  base: '/ecoarenergy-dashboard/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    middlewareMode: false,
    allowedHosts: ['*', '5173-i5q9lqnl8hoa36oxeexg1-416ab1ef.manusvm.computer', '5174-i5q9lqnl8hoa36oxeexg1-416ab1ef.manusvm.computer', '5175-i5q9lqnl8hoa36oxeexg1-416ab1ef.manusvm.computer'],
    proxy: {
      '/api': {
        target: 'https://tb8calt97j.execute-api.sa-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/dev'),
      },
    },
  },
})
