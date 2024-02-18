const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { voidTrs } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanAdminBarcode } = require('./scannerAndWeightUtils');

async function runTest(testFn, testName,testInfo) {
  const { window } = sharedContext;
  console.log('Running test:', testName);
  try {
    await testFn();
  } catch (error) {
    console.error('Test failed:', error);

    // Take a screenshot when an assertion fails
    const screenshotPath = `./screenshots/${testName}.png`;
    await window.screenshot({ path: screenshotPath });
    await testInfo.attach(testName,{
    body: await window.screenshot(),
    contentType: "image/png"
    })
    console.log(`Screenshot saved at ${screenshotPath}`);
   // console.log(`Screenshot saved at ${screenshotPath}`);

    // Mark the test step as failed by rethrowing the error
    throw error;
    
     // Log the error but do not throw it to continue execution
    // console.error('Test step failed:', error);
    // await scanAdminBarcode();
    // await voidTrs('OK');
    // await window.waitForTimeout(10000);
  }
}

module.exports = { runTest };
