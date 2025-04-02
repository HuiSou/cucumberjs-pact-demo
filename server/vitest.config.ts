import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global `describe`, `it`, etc.
    environment: 'node', // Use Node.js environment
  },
});