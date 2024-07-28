const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage, weightableItem, changePrice } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale, sendLegalScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);

test('test 20 - Change price to weight item', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(180000);
  //await window.waitForTimeout(10000);
  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  await window.waitForTimeout(2000);
  await startTrs();
  await window.waitForTimeout(2000);
  await window.locator('ion-button').filter({ hasText: 'ירקות' }).locator('svg').click();
  
  await weightableItem(dataset[14].itemName,dataset[14].itemPrice,dataset[14].itemWeight2,'approve','','',null,'');
  await window.waitForTimeout(2000);
  await sendSecurityScale(1.000);
  await window.getByRole('button', { name: 'chevron back outline חזרה' }).click();
  
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[14].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[14].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[14].itemWeight2);
  await scanAdminBarcode();
  await changePrice(dataset[14].itemBarcode,dataset[14].itemName,'400','weightableItem');

  await window.getByRole('contentinfo').getByText('₪4.00').click();
  await window.waitForTimeout(3000);
  await expect(window.getByText('1העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[14].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[14].itemWeight2);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[14].changeitemPrice);
  //
   
  await expect(window.getByText('סה"כ לתשלום ₪4.00')).toBeVisible();
  await expect(window.getByText('תשלום₪4.00')).toBeVisible();
  await window.getByText('להמשיך בקניות').click();
  // Get journeyId
  const journeyId = await sendEventtoCMR();
  await addJourneyId(journeyId);
  console.log("Journey ID:", journeyId);
  //
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await voidTrs('OK');
  await window.waitForTimeout(7000);
}, 'test 20 - Change price to weight item',testInfo);
});