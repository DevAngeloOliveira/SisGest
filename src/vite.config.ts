import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'uuid': path.resolve(__dirname, 'node_modules/uuid/dist/index.js')
        }
    },
    optimizeDeps: {
        include: ['uuid', 'idb']
    },
    server: {
        port: 3000,
        watch: {
            usePolling: true
        }
    }
}) 