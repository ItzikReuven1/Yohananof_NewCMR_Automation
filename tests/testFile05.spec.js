const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, weightChange, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);

test('test 05 - Void item', async ({}, testInfo) => {
  await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(90000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    // await window.waitForTimeout(20000);
    await startTrs();
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[7].itemBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(dataset[7].itemWeight)
    await window.waitForTimeout(2000);
    //
    await window.getByText('1', { exact: true }).click();
    await changeQuantity('Add',1);
    await window.waitForTimeout(2000);
    const itemWeight1 = parseFloat(dataset[7].itemWeight);
    const weighCalc=itemWeight1*2;
    await sendSecurityScale(weighCalc);
    // await sendSecurityScale(0.466);
    await window.waitForTimeout(4000);
    await sendSecurityScale(dataset[7].itemWeight);
    await weightChange('Yes');
    await window.getByRole('button', { name: 'trash outline' }).click();
    await changeQuantity('Remove',1);
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down1');
    await expect(window.getByText('Pricetagsקפה שלישייה 2ב22-₪5.80')).toBeHidden();
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪5.80' }).nth(1)).toBeHidden();
    await expect(window.getByRole('button', { name: 'תשלום (1 פריט) ₪13.90' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪13.90').click();

    //
    await window.waitForTimeout(3000);
    await expect(window.getByText('1העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪13.90');
    
    await expect(window.getByText('Pricetagsקפה שלישייה 2ב22-₪5.80')).toBeHidden();
    await expect(window.getByText('חסכון (מבצעים והנחות) -₪5.80')).toBeHidden();
    await expect(window.getByText('סה"כ לתשלום ₪13.90')).toBeVisible();
    await expect(window.getByText('תשלום₪13.90')).toBeVisible();
    await window.getByText('להמשיך בקניות').click();
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(5000);
  }, 'test 05 - Void item',testInfo);
  });
