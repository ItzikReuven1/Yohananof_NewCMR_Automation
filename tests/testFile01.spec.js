const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const getCartDate = require('./getCartDate');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);

test('test 01 - Regular Item & Is Quantity Item', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(180000);
  //await window.waitForTimeout(10000);
  const cartData = await getCartDate('10038');

   // Check if cartData is null and fail the test if it is
   if (cartData === null) {
    throw new Error('Cart data is null');
}

// Log the returned cartData
console.log('Cart Data:', cartData);

  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  await window.waitForTimeout(2000);
  await startTrs(1,'undefined');
  ////
  window.on('console', async (message) => {
    const logText = message.text();
    if (logText.includes('cartUpdate event from CMR')) {
        // Extract the TransactionId from the log message
        const match = logText.match(/"TransactionId":"([^"]+)"/);
        const transactionId = match ? match[1] : null;

        console.log('TransactionId:', transactionId);

        // You can use the transactionId in your test logic here
        // For example, assert that the TransactionId is not null
        expect(transactionId).not.toBeNull();
    }
});
  ////
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
  await window.getByRole('contentinfo').getByText('₪15.80').click();
  await window.waitForTimeout(3000);
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
}, 'test 01 - Regular Item & Is Quantity Item',testInfo);
});