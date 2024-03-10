const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage, manualBarcode, buyBags} = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

test.beforeAll(setupElectron);

test('test 11 - Sale with a large quantity of Items with Promotions', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(540000);
  //await window.waitForTimeout(10000);
  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  //await getHelp(window);
  await window.waitForTimeout(2000);
  await startTrs();
  await window.waitForTimeout(2000);
  await scanBarcode(dataset[1].itemBarcode);
  await window.waitForTimeout(2000);
  await sendSecurityScale(dataset[1].itemWeight);
  await window.waitForTimeout(2000);
  await scanBarcode(dataset[2].itemBarcode);
  await window.waitForTimeout(2000);
  await expect(window.getByText('שינוי כמות')).toBeVisible();
  await changeQuantity('Add',20);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  const itemWeight1 = parseFloat(dataset[1].itemWeight);
  const itemWeight2 = parseFloat(dataset[2].itemWeight);
  let weightCalc=(itemWeight2 * 21) + itemWeight1;
  await sendSecurityScale(weightCalc);

  await window.waitForTimeout(2000);
  await window.locator('#main-basket-items-container > div > div:nth-child(2) > app-basket-item > div > div > div.quantity-of-products.buffer-strip > app-quantity-of-products > div > span').click();
  await changeQuantity('Add',20);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  weightCalc = weightCalc + (itemWeight1 * 20);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(3000);
  await manualBarcode(dataset[4].itemBarcode);
  await window.waitForTimeout(4000);
  await window.locator('.item-type-normal').first().click();
  //locator('.item-type-normal').first()
  await changeQuantity('Add',20);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  const itemWeight4 = parseFloat(dataset[4].itemWeight);
  weightCalc = weightCalc + (itemWeight4 * 21);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(2000);

  await window.locator('ion-button').filter({ hasText: 'משקאות' }).locator('svg').click();
  await window.waitForTimeout(2000);
  await window.locator('ion-button').filter({ hasText: 'מים מינרלים גדול' }).locator('img').click();
  await window.waitForTimeout(4000);
  await window.locator('.item-type-normal').first().click();
  await window.waitForTimeout(4000);
  await changeQuantity('Add',20);
  await window.waitForTimeout(15000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  const itemWeight6 = parseFloat(dataset[6].itemWeight);
  weightCalc = weightCalc + (itemWeight6 * 21);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(2000);

  await scanBarcode(dataset[5].itemBarcode);
  await window.waitForTimeout(10000);
  const itemWeight5 = parseFloat(dataset[5].itemWeight);
  weightCalc = weightCalc + itemWeight5;
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(2000);


  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[5].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[5].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('כמות1');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[6].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[6].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down21');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[6].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(4)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(4)')).toContainText(dataset[6].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(5)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(5)')).toContainText(dataset[6].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(6)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(6)')).toContainText(dataset[6].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(7)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(7)')).toContainText(dataset[6].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(8)')).toContainText(dataset[4].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(8)')).toContainText(dataset[4].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(8)')).toContainText('Caret UpCaret Down21');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(9)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(9)')).toContainText(dataset[1].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(9)')).toContainText('Caret UpCaret Down21');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(10)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(10)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(11)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(11)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(12)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(12)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(13)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(13)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(14)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(14)')).toContainText(dataset[1].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(15)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(15)')).toContainText(dataset[2].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(15)')).toContainText('Caret UpCaret Down21');

  await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪29.00' }).nth(1)).toBeVisible();
  await expect(window.getByRole('button', { name: 'תשלום (85 פריטים) ₪573.00' })).toBeVisible();
  await window.getByRole('contentinfo').getByText('₪573.00').click();
  await window.waitForTimeout(3000);

  await expect(window.getByText('85העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[5].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText('X1 ₪3.50');
  //
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[6].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText('X21 ₪52.50');

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText(dataset[6].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(4)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(4)')).toContainText(dataset[6].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(5)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(5)')).toContainText(dataset[6].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(6)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(6)')).toContainText(dataset[6].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(7)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(7)')).toContainText(dataset[6].promotion);


  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(8)')).toContainText(dataset[4].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(8)')).toContainText('X21 ₪396.90');

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(9)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(9)')).toContainText('X21 ₪88.20');

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(10)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(10)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(11)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(11)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(12)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(12)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(13)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(13)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(14)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(14)')).toContainText(dataset[1].promotion);

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(15)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(15)')).toContainText('X21 ₪60.90');
  // 
  //await expect(window.getByText('חסכון (מבצעים והנחות) ₪29.00')).toBeVisible();
  await expect(window.getByText('סה"כ לתשלום ₪573.00')).toBeVisible();
  await expect(window.getByText('תשלום₪573.00')).toBeVisible();
  await buyBags('20');
  await window.waitForTimeout(30000);
  await window.getByRole('button', { name: 'דילוג' }).click();
  await window.waitForTimeout(8000);
  await expect(window.getByText('תשלום בכרטיס אשראי')).toBeVisible();
  await expect(window.getByText('העבירו את כרטיס האשראי במכשיר התשלום משמאלבמידת הצורך ניתן לבטל את התשלום דרך המ')).toBeVisible();
  await window.waitForTimeout(30000);
  await expect(window.locator('app-payment-error div').nth(1)).toBeVisible();
  await expect(window.getByText('לא הצלחנו להתחבר למערכת התשלום')).toBeVisible();
  await expect(window.getByText('חיזרו לסל הקניות ונסו שנות או קראו לצוות התמיכה')).toBeVisible();
  await window.getByRole('button', { name: 'חזרה לסל' }).click();
  // await expect(window.getByText('התשלום נכשל')).toBeVisible();
  // await expect(window.getByText('יש לבחור שיטת תשלום אחרת או לקרוא לעזרה')).toBeVisible();
  // await window.getByRole('button', { name: 'הבנתי, תודה' }).click();
  await window.waitForTimeout(2000);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[13].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[13].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('כמות20');

  await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪29.00' }).nth(1)).toBeVisible();
  await expect(window.getByRole('button', { name: 'תשלום (105 פריטים) ₪575.00' })).toBeVisible();
  await window.getByRole('contentinfo').getByText('₪575.00').click();
  await window.waitForTimeout(2000);
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await voidTrs('OK','large');
  await window.waitForTimeout(10000);
}, 'test 11 - Sale with a large quantity of Items with Promotions',testInfo);
});