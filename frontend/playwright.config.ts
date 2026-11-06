import { defineConfig, devices } from '@playwright/test'

const PORTA = 5174

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  timeout: process.env.E2E_TEMPO_REAL === '1' ? 600_000 : 120_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: 3,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }], ['./e2e/suporte/relatorio.ts']],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    locale: 'pt-BR',
    actionTimeout: 10_000,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'tablet', use: { ...devices['Galaxy Tab S4 landscape'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORTA} --strictPort`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    env: { VITE_USAR_MOCK: 'true' },
  },
})
