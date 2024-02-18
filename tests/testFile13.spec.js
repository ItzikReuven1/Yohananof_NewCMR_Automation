const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, changePrice, restoreMessage, cartLock, cartUnlock } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);

test('test 13 - Cart Lock & Unlock & Sale', async ({}, testInfo)=> {
 await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(180000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    await window.waitForTimeout(3000);
    await sendSecurityScale(0.800);
    await window.waitForTimeout(3000);
    await cartLock();
    await window.waitForTimeout(5000);
    await sendSecurityScale(0.0);
    await window.waitForTimeout(5000);
    await cartUnlock();
    await window.waitForTimeout(5000);
    await startTrs();
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[5].itemBarcode);
    await window.waitForTimeout(10000);
    await sendSecurityScale(dataset[5].itemWeight);
    await window.waitForTimeout(2000);
    //
    await window.locator('ion-button').filter({ hasText: 'משקאות' }).locator('svg').click();
    await window.waitForTimeout(2000);
    await window.locator('ion-button').filter({ hasText: 'מים מינרלים גדול' }).locator('img').click();
    await window.waitForTimeout(4000);
     ////weight Calcultion
     const itemWeight1 = parseFloat(dataset[5].itemWeight);
     const itemWeight2 = parseFloat(dataset[6].itemWeight);
     const weighCalc=itemWeight2 + itemWeight1;
     await sendSecurityScale(weighCalc);
    // await sendSecurityScale(1.556)
    await window.waitForTimeout(2000);
    // await expect(window.getByText('מים מינרלים גדולסה"כ₪2.50מחיר ליח\' :₪2.50כמות1')).toBeVisible();
    /////
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[5].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[5].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('1');
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[6].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[6].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down1');
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.00' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (2 פריטים) ₪5.70' })).toBeVisible();
    await scanAdminBarcode();
    await changePrice(dataset[6].itemBarcode,dataset[6].itemName,'150');
    //
    await window.getByRole('contentinfo').getByText('₪4.70').click();
    //
    await window.waitForTimeout(3000);
    await expect(window.getByText('2העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[6].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪1.50');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[5].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X1 ₪3.20');

    await expect(window.getByText('סה"כ לתשלום ₪4.70')).toBeVisible();
    await expect(window.getByText('תשלום₪4.70')).toBeVisible();
    await window.getByText('להמשיך בקניות').click();
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(7000);
  }, 'test 13 - Cart Lock & Unlock & Sale',testInfo);
  });
