const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage, weightableItem } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale, sendLegalScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);

test('test 16 - Weighable Item basic flow', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(180000);
  //await window.waitForTimeout(10000);
  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  await window.waitForTimeout(2000);
  await startTrs();
  await window.waitForTimeout(2000);
  await weightableItem(dataset[16].itemName,dataset[16].itemPrice,dataset[16].itemWeight,'approve',dataset[16].itemBarcode,'scan',dataset[16].itemNetWeight,dataset[16].itemPackWeight);
  await window.waitForTimeout(2000);
  await sendSecurityScale(dataset[16].itemWeight);
  await window.waitForTimeout(2000);
  await weightableItem(dataset[16].itemName,dataset[16].itemPrice,dataset[16].itemWeight,'approve',dataset[16].itemBarcode,'scan',dataset[16].itemNetWeight,dataset[16].itemPackWeight);
  await window.waitForTimeout(2000);
  const itemWeight1 = parseFloat(dataset[16].itemWeight);
  let weigthCalc = itemWeight1 * 2;
  await sendSecurityScale(weigthCalc);
  await window.waitForTimeout(2000);
  
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[16].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[16].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[16].itemWeight);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[16].itemPackWeight);

  await window.getByRole('contentinfo').getByText('₪1.18').click();
  await window.waitForTimeout(3000);
  await expect(window.getByText('1העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[14].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('בצל יבש0.200 ק"ג₪1.18');
  //
   
  await expect(window.getByText('סה"כ לתשלום ₪1.18')).toBeVisible();
  await expect(window.getByText('תשלום₪1.18')).toBeVisible();
  await window.getByText('להמשיך בקניות').click();
  //
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await voidTrs('OK');
  await window.waitForTimeout(7000);
}, 'test 16 - Weighable Item basic flow',testInfo);
});