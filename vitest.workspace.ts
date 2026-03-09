import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/draw/vitest.config.ts',
      './packages/draw-react/vitest.config.ts',
    ],
  },
})