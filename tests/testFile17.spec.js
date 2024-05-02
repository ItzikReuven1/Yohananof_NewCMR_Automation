const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, manualBarcode, restoreMessage, addWeightMessage, personalBagMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);

test('test 17 - Add & Remove PersonalBag with Sale', async ({}, testInfo) => {
await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(180000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    //await window.waitForTimeout(2000);
    await startTrs('undefined',0.250);
    await sendSecurityScale(0.400);
    await window.waitForTimeout(2000);
    await addWeightMessage('Info','Help');
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.250);
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.100);
    await personalBagMessage();
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.250);
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.050);
    await personalBagMessage();
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.150);
    await personalBagMessage('Ok');
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.300);
    await addWeightMessage();
    await sendSecurityScale(0.150);
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[3].itemBarcode);
    await window.waitForTimeout(2000);
    const itemWeight1 = parseFloat(dataset[3].itemWeight);
    let weigthCalc = 0.250 + itemWeight1;
    await sendSecurityScale(weigthCalc);
    await window.waitForTimeout(2000);
    await manualBarcode(dataset[4].itemBarcode);
    await window.waitForTimeout(2000);
     ////weight Calcultion
    const itemWeight2 = parseFloat(dataset[4].itemWeight);
    weigthCalc=itemWeight2 + weigthCalc;
    await sendSecurityScale(weigthCalc);
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
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[4].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪18.90');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[3].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X1 ₪29.90');

    await expect(window.getByText('סה"כ לתשלום ₪48.80')).toBeVisible();
    await expect(window.getByText('תשלום₪48.80')).toBeVisible();
    await window.getByText('להמשיך בקניות').click();
    // Get journeyId
    const journeyId = await sendEventtoCMR();
    await addJourneyId(journeyId);
    console.log("Journey ID:", journeyId);
    //
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(7000);
  }, 'test 17 - Add & Remove PersonalBag with Sale',testInfo);
  });
