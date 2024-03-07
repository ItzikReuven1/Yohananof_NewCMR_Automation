// @ts-check
const { defineConfig, devices } = require('@playwright/test');


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 15000 },
  workers:1,
 
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //trace: 'on-first-retry',
    browserName : 'chromium',
    headless : false,
    screenshot : 'only-on-failure',
    video:'retain-on-failure',
    trace: 'on'
  },

  projects: [
    {
      name: 'Yohananof Project - Sanity',
      // Add the test files in the desired order
      testMatch: ['**/testFile01.spec.js', '**/testFile02.spec.js', '**/testFile03.spec.js', '**/testFile04.spec.js', '**/testFile05.spec.js', '**/testFile06.spec.js'
      , '**/testFile07.spec.js', '**/testFile08.spec.js', '**/testFile09.spec.js','**/testFile10.spec.js','**/testFile11.spec.js','**/testFile12.spec.js','**/testFile13.spec.js','**/testFile14.spec.js','**/testFile15.spec.js',
      '**/testFile16.spec.js','**/testFile17.spec.js','**/testFile18.spec.js','**/testFile19.spec.js','**/testFile20.spec.js'],
      // ...
    },
  ],

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome']},
      
  //   },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

