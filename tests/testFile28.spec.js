const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, weightChange, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);

test('test 28 - Void incorrect item', async ({}, testInfo) => {
  await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(180000);
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
    let weighCalc=itemWeight1*2;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[8].itemBarcode);
    await window.waitForTimeout(2000);
    const itemWeight2 = parseFloat(dataset[8].itemWeight);
    weighCalc = weighCalc + itemWeight2;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    weighCalc = weighCalc - itemWeight1;
    await sendSecurityScale(weighCalc);
    await weightChange('Yes');
    await window.locator('app-basket-item').filter({ hasText: 'יטבתה פרו וניל 350סה"כ₪6.90' }).getByRole('button').click();
    await expect(window.getByText('הפריט שנסרק או נבחר אינו תואם את הפריט שהוצא מהעגלה. הפעולה בוטלה')).toBeVisible();
    await window.locator('app-basket-item').filter({ hasText: 'מארז קפה טורקי יוחננוף 3*85' }).getByRole('button').click();
    //await window.locator('//*[@id="main-basket-items-container"]/div/div[1]/app-basket-item/div/div/div[6]/ion-button//button').click();
    //await window.click('//*[@id="main-basket-items-container"]/div/div[1]/app-basket-item/div/div/div[6]/ion-button//button');
    await changeQuantity('Remove',1);
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[8].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[8].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down1');
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down1');
    await expect(window.getByText('Pricetagsקפה שלישייה 2ב22-₪5.80')).toBeHidden();
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪5.80' }).nth(1)).toBeHidden();
    await expect(window.getByRole('button', { name: 'תשלום (2 פריטים) ₪20.80' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪20.80').click();

    //
    await window.waitForTimeout(3000);
    await expect(window.getByText('2העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[8].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪6.90');
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X1 ₪13.90');
    
    await expect(window.getByText('Pricetagsקפה שלישייה 2ב22-₪5.80')).toBeHidden();
    await expect(window.getByText('חסכון (מבצעים והנחות) -₪5.80')).toBeHidden();
    await expect(window.getByText('סה"כ לתשלום ₪20.80')).toBeVisible();
    await expect(window.getByText('תשלום₪20.80')).toBeVisible();
    await window.getByText('להמשיך בקניות').click();
    // Get journeyId
    const journeyId = await sendEventtoCMR();
    await addJourneyId(journeyId);
    console.log("Journey ID:", journeyId);
    //
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(10000);
  }, 'test 28 - Void incorrect item',testInfo);
  });
