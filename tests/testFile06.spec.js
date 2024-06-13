const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, ageRestriction, itemNotFound, changeQuantity, restoreMessage, enterPhoneForReceipt, paymentScreen } = require('./cartFunctions');
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
    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪0.00' }).nth(1)).toBeVisible();
    await expect(window.getByRole('button', { name: 'תשלום (7 פריטים) ₪27.61' })).toBeVisible();
    await window.getByRole('contentinfo').getByText('₪27.61').click();
    

    
    await window.getByText('המשך').click();

    await window.waitForTimeout(2000);
    //await window.getByRole('button', { name: 'דילוג' }).click();
    await window.getByText('דילוג').click();
    await enterPhoneForReceipt('0545656468');
    await expect(window.getByText('Pricetagsקופון מילקי טופ 6ב24-₪3.62')).toBeVisible();
    await paymentScreen();
    await expect(window.getByText('תשלום בכרטיס אשראי')).toBeVisible();
    await expect(window.getByText('העבירו את כרטיס האשראי במכשיר התשלום משמאלבמידת הצורך ניתן לבטל את התשלום דרך המ')).toBeVisible();
    await window.waitForTimeout(30000);

    await expect(window.locator('app-payment-error div').nth(1)).toBeVisible();
    await expect(window.getByText('לא הצלחנו להתחבר למערכת התשלום')).toBeVisible();
    await expect(window.getByText('חיזרו לסל הקניות ונסו שנות או קראו לצוות התמיכה')).toBeVisible();
    await window.getByRole('button', { name: 'חזרה לסל' }).click();
    await window.waitForTimeout(2000);


    await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪3.62' }).nth(1)).toBeVisible();
    await window.getByText('₪23.99').click();
    await window.waitForTimeout(2000);
    await expect(window.getByText('7העגלה שלי')).toBeVisible();
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[9].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪0.01');
    //
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[8].itemName);
    await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X6 ₪27.60');
    await expect(window.getByText('Pricetagsקופון מילקי טופ 6ב24-₪3.62')).toBeVisible();
    await expect(window.getByText('חסכון (מבצעים והנחות) -₪3.62')).toBeVisible();
    await expect(window.getByText('סה"כ לתשלום ₪23.99')).toBeVisible();
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
