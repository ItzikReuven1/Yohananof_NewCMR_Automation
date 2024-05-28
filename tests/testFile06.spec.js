const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, restoreMessage, enterPhoneForReceipt } = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);

test('test 06 - Items With Coupon', async ({}, testInfo) => {
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
    await window.getByText('1', { exact: true }).click();
    await changeQuantity('Add',4);
    await window.waitForTimeout(2000);
    await sendSecurityScale(1.75);
    await window.waitForTimeout(2000);
    await scanBarcode(dataset[9].itemBarcode);
    await window.waitForTimeout(2000);

    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[8].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[8].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down5');
  
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[9].itemName);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[9].itemPrice);
    await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('כמות1');
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.00' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (6 פריטים) ₪34.51' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪34.51').click();
    

    
    await window.getByText('המשך').click();

    await window.waitForTimeout(2000);
    //await window.getByRole('button', { name: 'דילוג' }).click();
    await window.getByText('דילוג').click();
    await enterPhoneForReceipt('0545656468');
    await expect(window.getByText('Pricetagsקופון משקה חלב 5ב25-₪9.52')).toBeVisible();

    
    await expect(window.getByText('תשלום בכרטיס אשראי')).toBeVisible();
    await expect(window.getByText('העבירו את כרטיס האשראי במכשיר התשלום משמאלבמידת הצורך ניתן לבטל את התשלום דרך המ')).toBeVisible();
    await window.waitForTimeout(30000);

    await expect(window.locator('app-payment-error div').nth(1)).toBeVisible();
    await expect(window.getByText('לא הצלחנו להתחבר למערכת התשלום')).toBeVisible();
    await expect(window.getByText('חיזרו לסל הקניות ונסו שנות או קראו לצוות התמיכה')).toBeVisible();
    await window.getByRole('button', { name: 'חזרה לסל' }).click();
    await window.waitForTimeout(2000);


    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪9.52' }).nth(1)).toBeVisible();
    await window.getByText('₪24.99').click();
    await window.waitForTimeout(2000);
    await expect(window.getByText('6העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[9].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪0.01');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[8].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X5 ₪34.50');
    await expect(window.getByText('Pricetagsקופון משקה חלב 5ב25-₪9.52')).toBeVisible();
    await expect(window.getByText('חסכון (מבצעים והנחות) -₪9.52')).toBeVisible();
    await expect(window.getByText('סה"כ לתשלום ₪24.99')).toBeVisible();
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
  }, 'test 06 - Items With Coupon',testInfo);
  });
