const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage, weightableItem } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale, sendLegalScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);

test('test 27 - Weighable Items with pack weight', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(180000);
  //await window.waitForTimeout(10000);
  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  await window.waitForTimeout(2000);
  await startTrs();
  await window.waitForTimeout(2000);
  await window.locator('ion-button').filter({ hasText: 'פירות' }).locator('svg').click();
  await weightableItem(dataset[17].itemName,dataset[17].itemPrice,dataset[17].itemWeight,'approve','','',dataset[17].itemNetWeight,dataset[17].itemPackWeight);
  await window.waitForTimeout(2000);
  await sendSecurityScale(dataset[17].itemWeight);
  await window.waitForTimeout(2000);
  await weightableItem(dataset[17].itemName,dataset[17].itemPrice,dataset[17].itemWeight,'approve','','',dataset[17].itemNetWeight,dataset[17].itemPackWeight);
  await window.waitForTimeout(2000);
  const itemWeight1 = parseFloat(dataset[17].itemWeight);
  let weigthCalc = itemWeight1 * 2;
  await sendSecurityScale(weigthCalc);
  await window.waitForTimeout(2000);
  await window.getByRole('button', { name: 'chevron back outline חזרה' }).click();
  
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[17].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[17].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[17].itemNetWeight);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[17].itemPackWeight);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[17].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[17].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[17].itemNetWeight);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[17].itemPackWeight);

  await window.getByRole('contentinfo').getByText('₪11.36').click();
  await window.waitForTimeout(3000);
  await expect(window.getByText('2העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[17].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[17].itemNetWeight);
  //
   
  await expect(window.getByText('סה"כ לתשלום ₪11.36')).toBeVisible();
  await expect(window.getByText('תשלום₪11.36')).toBeVisible();
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
}, 'test 27 - Weighable Items with pack weight',testInfo);
});