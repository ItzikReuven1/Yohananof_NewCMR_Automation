const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, changePrice, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);

test('test 03 - Light Weight Item & Change Price', async ({}, testInfo)=> {
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
    await window.waitForTimeout(3000);
     ////weight Calcultion
     const itemWeight1 = parseFloat(dataset[5].itemWeight);
     const itemWeight2 = parseFloat(dataset[6].itemWeight);
     const weighCalc=itemWeight2 + itemWeight1;
     await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    await window.locator('ion-button').filter({ hasText: 'משקאות' }).locator('svg').click();
    await window.waitForTimeout(2000);
    await window.locator('ion-button').filter({ hasText: 'מים מינרלים גדול' }).locator('img').click();
    await window.waitForTimeout(4000);
    const weighCalc1=weighCalc + itemWeight2;
    await sendSecurityScale(weighCalc1);
    /////
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[5].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[5].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('כמות1');
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[6].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[6].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down2');
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.00' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (3 פריטים) ₪8.50' })).toBeVisible();
    await scanAdminBarcode();
    await changePrice(dataset[6].itemBarcode,dataset[6].itemName,'150');
    //
    await window.getByRole('contentinfo').getByText('₪6.50').click();
    //
    await window.waitForTimeout(3000);
    await expect(window.getByText('3העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[6].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X2 ₪3.00');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[5].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X1 ₪3.50');

    await expect(window.getByText('סה"כ לתשלום ₪6.50')).toBeVisible();
    await expect(window.getByText('תשלום₪6.50')).toBeVisible();
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
  }, 'test 03 - Light Weight Item & Change Price',testInfo);
  });
