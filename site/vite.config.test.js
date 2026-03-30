// Vite config for tests
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.js'],
    include: ['__tests__/**/*.test.{js,jsx}'],
    exclude: ['node_modules', 'dist', '**/*.spec.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '__tests__/',
        '**/__mocks__/*',
        '**/*.spec.js',
        '**/main.jsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Mock Supabase in tests
  optimizeDeps: {
    exclude: ['@supabase/supabase-js'],
  },
});
