const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage, weightableItem, weightMismatch } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale, sendLegalScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);

test('test 18 - Weighable Items with mismatch weight', async ({}, testInfo) => {
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
  
  await weightableItem(dataset[14].itemName,dataset[14].itemPrice,dataset[14].itemWeight,'approve','','',null,'');
  await window.waitForTimeout(2000);
  await sendSecurityScale(0.600);
  await weightMismatch();
  await window.waitForTimeout(2000);
  await sendSecurityScale(0.50);
  await weightMismatch();
  await window.waitForTimeout(2000);
  await sendSecurityScale(dataset[14].itemWeight);
  await window.waitForTimeout(2000);
  await weightableItem(dataset[15].itemName,dataset[15].itemPrice,dataset[15].itemWeight,'approve','','',null,'');
  await window.waitForTimeout(2000);
  let itemWeight1 = parseFloat(dataset[14].itemWeight);
  let itemWeight2 = itemWeight1 + 0.600;
  await sendSecurityScale(itemWeight2);
  await weightMismatch();
  await window.waitForTimeout(2000);
  itemWeight2 = itemWeight1 + 0.05;
  await sendSecurityScale(itemWeight2);
  await weightMismatch();
  await window.waitForTimeout(2000);
  let itemWeight3 = parseFloat(dataset[15].itemWeight);
  itemWeight3 = itemWeight3 + itemWeight1;
  await sendSecurityScale(itemWeight3);
  await window.waitForTimeout(2000);
  await window.getByRole('button', { name: 'chevron back outline חזרה' }).click();
  
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[15].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[15].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[15].itemWeight);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[14].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[14].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[14].itemWeight);


  await window.getByRole('contentinfo').getByText('₪3.10').click();
  await window.waitForTimeout(3000);
  await expect(window.getByText('2העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[15].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[15].itemWeight);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[15].ItemWeightedPrice);

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[14].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[14].itemWeight);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[14].ItemWeightedPrice);
  
  await expect(window.getByText('סה"כ לתשלום ₪3.10')).toBeVisible();
  await expect(window.getByText('תשלום₪3.10')).toBeVisible();
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
}, 'test 18 - Weighable Items with mismatch weight',testInfo);
});