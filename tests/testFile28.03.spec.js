const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, restoreMessage, enterPhoneForReceipt, paymentScreen, endShopping } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);

test('test 28.03 - Items With Coupon pay with gift card', async ({}, testInfo) => {
  await runTest(async (testInfo) => {
    const { window } = sharedContext;
    test.setTimeout(150000);
    await restoreMessage("Cancel");
    await sendSecurityScale(0.0);
    // await window.waitForTimeout(15000);
    await startTrs();
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[8].itemBarcode);
    await window.waitForTimeout(2000);
    await sendSecurityScale(dataset[8].itemWeight)
    await window.waitForTimeout(2000);
    //
    //await window.getByText('1', { exact: true }).click();
    await changeQuantity('Add',5);
    await window.waitForTimeout(2000);
    const itemWeight1 = parseFloat(dataset[8].itemWeight);
    const weighCalc=(itemWeight1 * 6);
    await sendSecurityScale(weighCalc);
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[9].itemBarcode);
    await window.waitForTimeout(2000);

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[8].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[8].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down6');
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[9].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[9].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('כמות1');
    // Calculate the total price
    const itemPrice1 = parseFloat(dataset[8].itemPriceX6.replace('₪', ''));
    const itemPrice2 = parseFloat(dataset[9].itemPrice.replace('₪', ''));
    let totalPrice = (itemPrice1 + itemPrice2).toFixed(2);
    
    
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.00' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: `תשלום (7 פריטים) ₪${totalPrice}` })).toBeVisible();
    await window.getByRole('contentinfo').getByText(`₪${totalPrice}`).click();

    await window.getByText('המשך').click();
    await window.waitForTimeout(2000);
    await window.getByText('דילוג').click();
    await enterPhoneForReceipt('0545656468');

    await expect(window.getByText(`Pricetags${dataset[9].promotionName}-${dataset[9].promotion}`)).toBeVisible();
    const itemPrice3 = parseFloat(dataset[9].promotion.replace('₪', ''));
    totalPrice = totalPrice - itemPrice3;
    await expect(window.getByText(`חסכון (מבצעים והנחות) -${dataset[9].promotion}`)).toBeVisible();
    await expect(window.getByText(`סה"כ לתשלום ₪${totalPrice}`)).toBeVisible();
    await expect(window.getByText(`תשלום₪${totalPrice}`)).toBeVisible();
    // Get journeyId
    const journeyId = await sendEventtoCMR();
    await addJourneyId(journeyId);
    console.log("Journey ID:", journeyId);
    //
    const pay = "giftcard";
    await paymentScreen(pay,dataset[0].giftCard);
    await endShopping();
    await sendSecurityScale(0.0);
    await window.waitForTimeout(5000);
  }, 'test 28.03 - Items With Coupon pay with gift card',testInfo);
  });
