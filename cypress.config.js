/* eslint-disable */
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: false
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      supportFile: false,
    },
  },
});
