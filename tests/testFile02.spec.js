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

test('test 02 - Age Restricted item & Manual Barcode', async ({}, testInfo) => {
await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(180000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    await startTrs();
    await window.waitForTimeout(2000);
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

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[3].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[3].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down1');
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[4].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[4].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down1');
    
    // Calculate the total price
    const itemPrice1 = parseFloat(dataset[3].itemPrice.replace('₪', ''));
    const itemPrice2 = parseFloat(dataset[4].itemPrice.replace('₪', ''));
    const totalPrice = (itemPrice1 + itemPrice2).toFixed(2);

    await expect(window.getByRole('button', { name: `תשלום (2 פריטים) ₪${totalPrice}` })).toBeVisible();
    await window.getByRole('contentinfo').getByText(`₪${totalPrice}`).click();
    //await window.getByRole('contentinfo').getByText('₪53.80').click();
    //
    await ageRestriction();

    //await window.getByRole('contentinfo').getByText('₪53.80').click();
    await window.getByRole('contentinfo').getByText(`₪${totalPrice}`).click();
    await window.waitForTimeout(3000);
    await expect(window.getByText('2העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[3].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(`X1 ${dataset[3].itemPrice}`);
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[4].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(`X1 ${dataset[4].itemPrice}`);

    await expect(window.getByText(`סה"כ לתשלום ₪${totalPrice}`)).toBeVisible();
    await expect(window.getByText(`תשלום₪${totalPrice}`)).toBeVisible();
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
  }, 'test 02 - Age Restricted item & Manual Barcode',testInfo);
  });

  