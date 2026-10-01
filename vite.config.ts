import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'node:path';
import { buildSync } from 'esbuild';

const buildPreload = () => {
  try {
    buildSync({
      entryPoints: ['electron/preload.ts'],
      outfile: 'dist-electron/preload.cjs',
      format: 'cjs',
      platform: 'node',
      bundle: true,
      external: ['electron'],
    });
  } catch (err) {
    console.error('Failed to build preload.cjs:', err);
  }
};

buildPreload();

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process entry
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron', 'electron-log'],
            },
          },
        },
      },
    ]),
    renderer(),
    {
      name: 'watch-preload',
      handleHotUpdate({ file, server }) {
        if (file.includes('preload.ts')) {
          buildPreload();
          server.ws.send({ type: 'full-reload' });
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-framer': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 5173,
    watch: {
      ignored: ['**/release/**', '**/dist/**', '**/dist-electron/**'],
    },
  },
});
