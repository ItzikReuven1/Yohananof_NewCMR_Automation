const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, changePrice, restoreMessage, changeQuantity } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);

test('test 10 - Cancel Items', async ({}, testInfo)=> {
 await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(90000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    // await window.waitForTimeout(20000);
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

    await window.locator('.item-type-normal').first().click();
    await window.waitForTimeout(2000);
    await changeQuantity('Add',2);
    await window.waitForTimeout(2000);
    await window.getByRole('button', { name: 'ביטול הוספה' }).click();
    await window.waitForTimeout(3000);
    await window.getByRole('button', { name: 'trash outline' }).click();
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.0);
    await window.waitForTimeout(2000);
    /////
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[5].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[5].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('פריט הוסר');
  
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.00' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (0 פריטים) ₪0.00' })).toBeVisible();
    await scanAdminBarcode();  
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(5000);
  }, 'test 10 - Cancel Items',testInfo);
  });
