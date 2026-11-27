import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The production build is a single self-contained index.html (JS + CSS inlined),
// so it works offline straight from file://.
export default defineConfig({
  // Relative paths, so the build works at any URL (e.g. https://<user>.github.io/<repo>/).
  base: './',
  plugins: [vue(), viteSingleFile()],
});
