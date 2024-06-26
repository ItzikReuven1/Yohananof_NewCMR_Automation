const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, cartRestore, restoreMessage, restoreSuccessful, importTrs } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);


test('test 22 - Import Transaction part 2', async ({}, testInfo) => {
 await runTest(async (testInfo) => {
    const { window } = sharedContext; 
    test.setTimeout(90000);  
    //await window.waitForTimeout(15000);
    await restoreMessage("Cancel");
    await window.waitForTimeout(2000);
    await scanAdminBarcode();
    await importTrs(dataset[0].cartNumber);

    await window.waitForTimeout(2000);
    await scanAdminBarcode();
    await window.locator('app-manager-options').getByText('דילוג אימות מספר נייד').click();
    await window.waitForTimeout(2000);
    await restoreSuccessful();
    
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemPrice);
    //await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down2');
    await expect(window.getByText(`Pricetags${dataset[7].promotionName}-${dataset[7].promotion}`)).toBeVisible();
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].promotionName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].promotion);

    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.80' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (2 פריטים) ₪11.00' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪11.00').click();
    //////
    await window.waitForTimeout(3000);
    await expect(window.getByText('2העגלה שלי')).toBeVisible();
    
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(`X2 ${dataset[7].itemPriceX2}`);
    await expect(window.getByText(`Pricetags${dataset[7].promotionName}-${dataset[7].promotion}`)).toBeVisible();
    await expect(window.getByText('חסכון (מבצעים והנחות) -₪0.80')).toBeVisible();
    await expect(window.getByText('סה"כ לתשלום ₪11.00')).toBeVisible();
    await expect(window.getByText('תשלום₪11.00')).toBeVisible();
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
  }, 'test 22 - Import Transaction part 2',testInfo);
  });
