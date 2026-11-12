import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: '/Mon-Compagnon/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'disable-hmr-websocket',
        apply: 'serve',
        transform(code, id) {
          if (id.replace(/\\/g, '/').endsWith('/vite/dist/client/client.mjs')) {
            return code
              .replace('console.debug("[vite] connecting...");', '')
              .replace(
                'transport.connect(createHMRHandler(handleMessage));',
                '/* HMR WebSocket disabled in preview */'
              );
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: false,
      ws: false,
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
