const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage, weightMismatch } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);

test('test 19 - Allow change qty & Is qty item with mismatch weight', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(180000);
  //await window.waitForTimeout(10000);
  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  await window.waitForTimeout(2000);
  await startTrs(1,'undefined');
  await window.waitForTimeout(2000);
  await scanBarcode(dataset[1].itemBarcode);
  await window.waitForTimeout(2000);
  await sendSecurityScale(dataset[1].itemWeight);
  await window.waitForTimeout(2000);
  await scanBarcode(dataset[2].itemBarcode);
  await window.waitForTimeout(2000);
  //await expect(window.getByText('בחירת כמות חדשה')).toBeVisible();
  await changeQuantity('Add',4);
  await window.waitForTimeout(2000);
  ////weight Calcultion
  const itemWeight1 = parseFloat(dataset[1].itemWeight);
  const itemWeight2 = parseFloat(dataset[2].itemWeight);
  const weighCalc=(itemWeight2 * 4) + itemWeight1;
  await sendSecurityScale(weighCalc);
  await weightMismatch();
  await window.waitForTimeout(2000);
  await window.locator('#main-basket-items-container > div > div:nth-child(1) > app-basket-item > div > div > div.quantity-of-products.buffer-strip > app-quantity-of-products > div > span').click();
  await changeQuantity('Remove',1);
  await window.waitForTimeout(2000);
  

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[1].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down1');


  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[2].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down4');

  //await window.locator('#main > app-main-basket > ion-footer > app-main-footer > div > ion-button > div > div.button-payment-amount').click();
  await window.getByRole('contentinfo').getByText('₪15.80').click();
  await window.waitForTimeout(2000);
  await expect(window.getByText('5העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X4 ₪11.60');
  //
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X1 ₪4.20');
  // 
  await expect(window.getByText('סה"כ לתשלום ₪15.80')).toBeVisible();
  await expect(window.getByText('תשלום₪15.80')).toBeVisible();
  await window.getByText('להמשיך בקניות').click();
  //
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await voidTrs('OK');
  await window.waitForTimeout(7000);
},'test 19 - Allow change qty & Is qty item with mismatch weight',testInfo);
});