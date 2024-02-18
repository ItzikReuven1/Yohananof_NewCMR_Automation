const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, weightMismatch, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);
// test.afterAll(teardownElectron);

test('test 09 - InstoreBarcode items with weight Mismatch', async ({}, testInfo) => {
  await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(90000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    // await window.waitForTimeout(15000);
    await startTrs();
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[10].itemInstoreBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(dataset[10].itemWeight)
    await window.waitForTimeout(2000);
    //
    await scanBarcode(dataset[11].itemInstoreBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(2.400);
    await window.waitForTimeout(4000);
    await weightMismatch();
    //weight Calcultion
    const itemWeight1 = parseFloat(dataset[10].itemWeight);
    const itemWeight2 = parseFloat(dataset[11].itemWeight);
    let weighCalc=itemWeight2 + itemWeight1;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[12].itemInstoreBarcode);
    await window.waitForTimeout(2000);
    const itemWeight3 = parseFloat(dataset[12].itemWeight);
    weighCalc=weighCalc + itemWeight3;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    //
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[10].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[10].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText('משקל1.152 ק"ג');
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[11].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[11].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down1');

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[12].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[12].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('1');

    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.00' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (3 פריטים) ₪32.54' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪32.54').click();
    //
    await window.waitForTimeout(3000);
    await expect(window.getByText('3העגלה שלי')).toBeVisible();

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[12].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('מארז בייגלה 3 יחX1 ₪');

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[11].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('שישיית לחמניות המבורגרX1 ₪');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText(dataset[10].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText('בצל יבש1.152 ק"ג₪');
    await expect(window.getByText('סה"כ לתשלום ₪32.54')).toBeVisible();
    await expect(window.getByText('תשלום₪32.54')).toBeVisible();
    await window.getByText('להמשיך בקניות').click();
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(5000);
  }, 'test 09 - InstoreBarcode items with weight Mismatch',testInfo);
  });
