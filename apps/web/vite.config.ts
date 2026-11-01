import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ESM-safe __dirname resolution
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // 🔒 Prevent local node_modules generation: redirect Vite pre-bundle cache to monorepo root
  cacheDir: path.resolve(__dirname, '../../node_modules/.vite/web'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@workspace/contracts': path.resolve(
        __dirname,
        '../../packages/contracts/src/index.ts'
      ),
      '@workspace/ai-hub': path.resolve(
        __dirname,
        '../../packages/ai-hub/src/index.ts'
      ),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});