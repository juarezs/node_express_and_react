import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
      SQLITE_DIR: ':memory:',
      UPLOAD_DIR: 'tmp/'
    },
    coverage: {
      provider: 'v8'
    },
  },
});
