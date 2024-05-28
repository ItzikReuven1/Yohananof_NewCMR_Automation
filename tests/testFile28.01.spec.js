const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, weightMismatch, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
// test.afterAll(teardownElectron);

test('test 28.01 - InstoreBarcode by Weight with Promotion and weight Mismatch', async ({}, testInfo) => {
  await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(90000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    // await window.waitForTimeout(15000);
    await startTrs();
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[16].itemInstoreBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(0.8);
    await weightMismatch();
    await window.waitForTimeout(2000);
    await sendSecurityScale(3.0);
    await weightMismatch();
    await window.waitForTimeout(2000);
    await sendSecurityScale(dataset[16].itemWeight)
    await window.waitForTimeout(2000);
    //
    await scanBarcode(dataset[16].itemInstoreBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(2.400);
    await window.waitForTimeout(2000);
    await weightMismatch();
    //weight Calcultion
    const itemWeight1 = parseFloat(dataset[16].itemWeight);
    const itemWeight2 = parseFloat(dataset[16].itemWeightMax);
    let weighCalc=itemWeight2 + itemWeight1;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[16].itemInstoreBarcode);
    await window.waitForTimeout(2000);
    const itemWeight3 = parseFloat(dataset[16].itemWeightMin);
    weighCalc=weighCalc + 0.400;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    await weightMismatch();
    weighCalc=weighCalc - 0.400;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    await weightMismatch();
    weighCalc=weighCalc + itemWeight3;
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    //
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[16].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[16].itemPrice);
    
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[16].promotionName);

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[16].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[16].itemPrice);
    
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(4)')).toContainText(dataset[16].promotionName);

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(5)')).toContainText(dataset[16].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(5)')).toContainText(dataset[16].itemPrice);
    
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(6)')).toContainText(dataset[16].promotionName);
    

    

    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪69.56' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (3 פריטים) ₪456.70' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪456.70').click();
    //
    await window.waitForTimeout(3000);
    await expect(window.getByText('3העגלה שלי')).toBeVisible();

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[16].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[16].itemPrice);

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText((dataset[16].promotionName));
    

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText(dataset[16].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText(dataset[16].itemPrice);

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(4)')).toContainText((dataset[16].promotionName));

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(5)')).toContainText(dataset[16].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(5)')).toContainText(dataset[16].itemPrice);

    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(6)')).toContainText((dataset[16].promotionName));
    
    await expect(window.getByText('חסכון (מבצעים והנחות) -₪69.56')).toBeVisible();
    await expect(window.getByText('סה"כ לתשלום ₪456.70')).toBeVisible();
    await expect(window.getByText('תשלום₪456.70')).toBeVisible();
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
  }, 'test 28.01 - InstoreBarcode by Weight with Promotion and weight Mismatch',testInfo);
  });
