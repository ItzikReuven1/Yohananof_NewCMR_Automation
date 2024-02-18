const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, manualBarcode, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);

test('test 02 - Age Restricted item & Manual Barcode', async ({}, testInfo) => {
await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(120000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    //await window.waitForTimeout(2000);
    await startTrs();
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[3].itemBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(dataset[3].itemWeight);
    await window.waitForTimeout(2000);
    await manualBarcode(dataset[4].itemBarcode);
    await window.waitForTimeout(2000);
     ////weight Calcultion
    const itemWeight1 = parseFloat(dataset[3].itemWeight);
    const itemWeight2 = parseFloat(dataset[4].itemWeight);
    const weighCalc=itemWeight2 + itemWeight1;
    await sendSecurityScale(weighCalc);
    ///Price Calculation
    // const itemPrice1 = parseFloat(dataset[3].itemPrice);
    // const itemPrice2 = parseFloat(dataset[4].itemPrice);
    // const priceCalc=itemPrice2 + itemPrice1;
    // await sendSecurityScale(3.24);
    await window.waitForTimeout(2000);

    //await expect(window.getByText('שוקולד חלב חמישיהסה"כ₪18.90מחיר ליח\' :₪18.90כמות1')).toBeVisible();
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[3].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[3].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down1');
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[4].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[4].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down1');


    expect(await window.getByRole('button', { name: 'תשלום (2 פריטים) ₪48.80' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪48.80').click();
    //
    await ageRestriction();

    await window.getByRole('contentinfo').getByText('₪48.80').click();
    await window.waitForTimeout(3000);
    await expect(window.getByText('2העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[3].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X1 ₪29.90');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[4].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪18.90');

    await expect(window.getByText('סה"כ לתשלום ₪48.80')).toBeVisible();
    await expect(window.getByText('תשלום₪48.80')).toBeVisible();
    await window.getByText('להמשיך בקניות').click();
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(5000);
  }, 'test 02 - Age Restricted item & Manual Barcode',testInfo);
  });
