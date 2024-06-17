const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, restoreMessage } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);

test('test 04 - Item Not Found & Item With Promotion', async ({}, testInfo) => {
  await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(90000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    //await window.waitForTimeout(20000);
    await startTrs();
    await window.waitForTimeout(2000);
    await scanBarcode('72901112334749');
    await window.waitForTimeout(2000);
    //await itemNotFound('Help');
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[7].itemBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(dataset[7].itemWeight)
    await window.waitForTimeout(2000);
    //
    await scanBarcode(dataset[7].itemBarcode);
    await window.waitForTimeout(2000);
    const itemWeight1 = parseFloat(dataset[7].itemWeight);
    const weighCalc=itemWeight1*2;
    await sendSecurityScale(weighCalc);

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[7].itemPrice);
    //await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('Caret UpCaret Down2');

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].promotionName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[7].promotion);

    // Calculate the total price
    const itemPrice1 = parseFloat(dataset[7].itemPriceX2.replace('₪', ''));
    const itemPrice2 = parseFloat(dataset[7].promotion.replace('₪', ''));
    const totalPrice = (itemPrice1 - itemPrice2).toFixed(2);

    await expect(window.locator('div').filter({ hasText: `סה"כ חסכת${dataset[7].promotion}` }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: `תשלום (2 פריטים) ₪${totalPrice}` })).toBeVisible();
    await window.getByRole('contentinfo').getByText(`₪${totalPrice}`).click();

    //
    await window.waitForTimeout(3000);
    await expect(window.getByText('2העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[7].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(`X2 ${dataset[7].itemPriceX2}`);


    await expect(window.getByText(`Pricetags${dataset[7].promotionName}-${dataset[7].promotion}`)).toBeVisible();
    await expect(window.getByText(`חסכון (מבצעים והנחות) -${dataset[7].promotion}`)).toBeVisible();
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
  }, 'test 04 - Item Not Found & Item With Promotion',testInfo);
  });
