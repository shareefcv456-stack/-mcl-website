import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Uses the locally installed Google Chrome — no Playwright browser download needed.
    channel: "chrome",
    trace: "retain-on-failure",
    // A fresh client IP per run so repeated local runs don't trip the forms' 5-per-minute rate limit.
    extraHTTPHeaders: { "x-forwarded-for": `e2e-${Date.now()}` },
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "tablet", use: { viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  // Tests run against the production build: `npm run build` first.
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    // Never send the tests' invented tracking numbers to IMD's production API: a blank customer code keeps tracking
    // in its `not_connected` state (variables already set here are not overridden by .env.local).
    env: { IMD_TRACKING_CUSTOMER_CODE: "" },
    timeout: 60_000,
  },
});
