import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Library-app/', // назва вашого репозиторію, інакше на gh-pages буде білий екран
  server: { port: 9000, open: true },
  build: { outDir: 'dist' },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
      },
    },
  },
});