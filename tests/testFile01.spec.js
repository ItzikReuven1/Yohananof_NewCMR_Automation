const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);

test('test 01 - Regular Item & Is Quantity Item', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(180000);
  await deleteJourneyIdsFile();
  await deleteOrderReportFile();
  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  await window.waitForTimeout(2000);
  await startTrs(1,'undefined');
  await getHelp();
  await window.waitForTimeout(3000);
  await getHelp('',"cancel");
  await window.waitForTimeout(3000);
  await scanBarcode(dataset[1].itemBarcode);
  await window.waitForTimeout(3000);
  await sendSecurityScale(dataset[1].itemWeight);
  await window.waitForTimeout(3000);
  await scanBarcode(dataset[2].itemBarcode);
  await window.waitForTimeout(3000);
  //await expect(window.getByText('בחירת כמות חדשה')).toBeVisible();
  await changeQuantity('Add',3);
  await window.waitForTimeout(2000);
  ////weight Calcultion
  const itemWeight1 = parseFloat(dataset[1].itemWeight);
  const itemWeight2 = parseFloat(dataset[2].itemWeight);
  const weighCalc=(itemWeight2 * 4) + itemWeight1;
  await sendSecurityScale(weighCalc);
  ///Price Calculation
  await window.waitForTimeout(2000);
  

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[1].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down1');


  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[2].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down4');

  //await window.locator('#main > app-main-basket > ion-footer > app-main-footer > div > ion-button > div > div.button-payment-amount').click();
  // Calculate the total price
  const itemPrice1 = parseFloat(dataset[2].itemPriceX4.replace('₪', ''));
  const itemPrice2 = parseFloat(dataset[1].itemPrice.replace('₪', ''));
  const totalPrice = (itemPrice1 + itemPrice2).toFixed(2);
 
  await window.getByRole('contentinfo').getByText(`₪${totalPrice}`).click();
  await window.waitForTimeout(3000);
  await expect(window.getByText('5העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(`X4 ${dataset[2].itemPriceX4}`);
  //
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(`X1 ${dataset[1].itemPrice}`);

  await expect(window.getByText(`סה"כ לתשלום ₪${totalPrice}`)).toBeVisible();
  await expect(window.getByText(`תשלום₪${totalPrice}`)).toBeVisible();
  await window.getByText('להמשיך בקניות').click();
  // Get journeyId
  const journeyId = await sendEventtoCMR();
  await addJourneyId(journeyId);
  console.log("Journey ID:", journeyId);
  //
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await voidTrs('OK');
  await window.waitForTimeout(5000);
}, 'test 01 - Regular Item & Is Quantity Item',testInfo);
});