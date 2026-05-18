/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/*.spec.tsx',
        '**/*.spec.ts',
        'src/main.tsx',
        'src/setupTests.ts',
        'src/api.ts',
        'src/types.ts',
        'src/__mocks__/**',
      ],
      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
})
