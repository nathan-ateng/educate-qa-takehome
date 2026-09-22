const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4000' },
  webServer: {
    command: 'node mock-server/server.js',
    url: 'http://localhost:4000/health',
    reuseExistingServer: true,
  },
});