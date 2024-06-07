import path from 'path';
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    environment: 'jsdom',
    globals: true,
    coverage: {
      exclude: ['**.config.js', '.eslintrc.cjs', 'src/components/ui/*', 'src/lib/utils.ts', 'src/main.tsx'],
      provider: 'v8'
    },
  },
});
