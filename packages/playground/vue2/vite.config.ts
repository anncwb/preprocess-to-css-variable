import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';

import styleImport, { AndDesignVueResolve } from 'vite-plugin-style-import';

export default defineConfig({
  plugins: [
    createVuePlugin(),
    styleImport({
      resolves: [AndDesignVueResolve()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
