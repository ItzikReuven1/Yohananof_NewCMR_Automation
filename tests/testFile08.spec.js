const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, cartRestore, restoreMessage, restoreSuccessful } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);


test('test 08 - Restore Transaction part 2', async ({}, testInfo) => {
 await runTest(async (testInfo) => {
    const { window } = sharedContext; 
    test.setTimeout(90000);  
    //await window.waitForTimeout(15000);
    await restoreMessage("OK");
    await window.waitForTimeout(3000);
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await window.locator('app-manager-options').getByText('דילוג אימות מספר נייד').click();
    await window.waitForTimeout(2000);
    await restoreSuccessful();

    // Calculate the total price
    const itemPrice1 = parseFloat(dataset[7].itemPriceX2.replace('₪', ''));
    const itemPrice2 = parseFloat(dataset[7].promotion.replace('₪', ''));
    const totalPrice = (itemPrice1 - itemPrice2).toFixed(2);
    
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemPrice);
    //await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down2');
    await expect(window.getByText(`Pricetags${dataset[7].promotionName}-${dataset[7].promotion}`)).toBeVisible();
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].promotionName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].promotion);

    await expect(window.locator('div').filter({ hasText: `סה"כ חסכת${dataset[7].promotion}` }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: `תשלום (2 פריטים) ₪${totalPrice}` })).toBeVisible();
    await window.getByRole('contentinfo').getByText(`₪${totalPrice}`).click();
    //////
    await window.waitForTimeout(3000);
    await expect(window.getByText('2העגלה שלי')).toBeVisible();
    
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(`X2 ${dataset[7].itemPriceX2}`);
    await expect(window.getByText(`Pricetags${dataset[7].promotionName}-${dataset[7].promotion}`)).toBeVisible();
    await expect(window.getByText(`חסכון (מבצעים והנחות) -${dataset[7].promotion}`)).toBeVisible();
    await expect(window.getByText(`סה"כ לתשלום ₪${totalPrice}`)).toBeVisible();
    await expect(window.getByText(`תשלום₪${totalPrice}`)).toBeVisible();
    // Get journeyId
    const journeyId = await sendEventtoCMR();
    await addJourneyId(journeyId);
    console.log("Journey ID:", journeyId);
    //
    await scanAdminBarcode();
    await window.waitForTimeout(2000);
    await voidTrs('OK');
    await window.waitForTimeout(5000);
  }, 'test 08 - Restore Transaction part 2',testInfo);
  });
