const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, manualBarcode, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');
const fs = require('fs');

test.beforeAll(setupElectron);
test.afterAll(teardownElectron);

test('test 30 - Check Orders in MongoDB', async ({}, testInfo) => {
await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(180000);
    await window.waitForTimeout(5000);
    ///////
    const journeyIdsFile = fs.readFileSync('journeyIds.json', 'utf8');
    const journeyIds = journeyIdsFile.trim().split('\n').map((line) => line.trim()); // Split by new lines and trim each line
    // Call getOrders with the array of journeyIds
    await getOrders(journeyIds);
    ///////
  }, 'test 30 - Check Orders in MongoDB',testInfo);
  });

  