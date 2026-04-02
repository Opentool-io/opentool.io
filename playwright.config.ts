import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 15000,
  use: {
    baseURL: "http://localhost:8877",
    headless: true,
  },
  webServer: {
    command: "python3 -m http.server 8877",
    port: 8877,
    reuseExistingServer: true,
  },
});
