import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.js'],
    watchExclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/cursor/**',
      '**/copilot/**',
      '**/windsurf/**',
      '**/claude-code/**'
    ]
  }
})