const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, manualBarcode, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);

test('test 15 - Decline Age Restricted item', async ({}, testInfo) => {
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
    await ageRestriction('Decline');
    await window.waitForTimeout(2000);
    //await window.locator('#main-basket-items-container > div > div:nth-child(1) > app-basket-item > div > div > div.action-button > ion-button > img').click();
    await window.locator('app-basket-item').filter({ hasText: 'בירה בקס שישייה 275 מ"לסה"כ₪' }).getByRole('button').click();
    await window.waitForTimeout(2000);
    await sendSecurityScale(dataset[4].itemWeight);


    await window.getByRole('contentinfo').getByText('₪18.90').click();
    await window.waitForTimeout(3000);
    await expect(window.getByText('1העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[4].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪18.90');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[3].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X0 ₪0.00');

    await expect(window.getByText('סה"כ לתשלום ₪18.90')).toBeVisible();
    await expect(window.getByText('תשלום₪18.90')).toBeVisible();
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
  }, 'test 15 - Decline Age Restricted item',testInfo);
  });
