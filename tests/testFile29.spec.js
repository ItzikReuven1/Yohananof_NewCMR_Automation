const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { getHelp, startTrs, voidTrs, changeQuantity, restoreMessage, manualBarcode, buyBags, enterPhoneForReceipt, approveImbalance, addWeightMessage} = require('./cartFunctions');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const { scanBarcode, scanAdminBarcode, sendSecurityScale } = require('./scannerAndWeightUtils');
const { runTest } = require('./testWrapper');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
const { sendEventtoCMR, addJourneyId, deleteJourneyIdsFile } = require('./journeyIds');
const { deleteOrderReportFile, getOrders } = require('./getOrders');

test.beforeAll(setupElectron);
//test.afterAll(teardownElectron);

test('test 29 - Adding Ghost Weight in CheckOut Screens', async ({}, testInfo) => {
await runTest(async (testInfo) => {
  const { window } = sharedContext;
  test.setTimeout(1000000);
  //await window.waitForTimeout(10000);
  await restoreMessage("Cancel");
  await sendSecurityScale(0.0);
  //await getHelp(window);
  await window.waitForTimeout(2000);
  await startTrs();
  await window.waitForTimeout(2000);
  const ghostWeight = parseFloat(dataset[0].ghostWeight);
  const ghostWeight1 = parseFloat(dataset[0].ghostWeight1);
  let weightCalc;
  weightCalc = ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(3000)
  await scanBarcode(dataset[1].itemBarcode);
  await window.waitForTimeout(2000);
  const itemWeight1 = parseFloat(dataset[1].itemWeight);
  weightCalc = weightCalc + itemWeight1;
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(2000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(2000)
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(2000)
  await scanBarcode(dataset[2].itemBarcode);
  await window.waitForTimeout(2000);
  await expect(window.getByText('שינוי כמות')).toBeVisible();
  await changeQuantity('Add',20);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  //const itemWeight1 = parseFloat(dataset[1].itemWeight);
  const itemWeight2 = parseFloat(dataset[2].itemWeight);
  weightCalc = weightCalc + ghostWeight
  await sendSecurityScale(weightCalc);
  weightCalc = weightCalc + (itemWeight2 * 21);
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(3000);
  await window.locator('#main-basket-items-container > div > div:nth-child(1) > app-basket-item > div > div > div.quantity-of-products.buffer-strip > app-quantity-of-products > div > span').click();
  await changeQuantity('Remove',10);
  await window.waitForTimeout(3000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  weightCalc = weightCalc - (itemWeight2 * 10);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  //
  await window.waitForTimeout(3000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.locator('#main-basket-items-container > div > div:nth-child(2) > app-basket-item > div > div > div.quantity-of-products.buffer-strip > app-quantity-of-products > div > span').click();
  await changeQuantity('Add',20);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  weightCalc = weightCalc + (itemWeight1 * 20);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(3000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.locator('#main-basket-items-container > div > div:nth-child(1) > app-basket-item > div > div > div.quantity-of-products.buffer-strip > app-quantity-of-products > div > span').click();
  await changeQuantity('Remove',10);
  await window.waitForTimeout(3000);
  weightCalc= weightCalc - (itemWeight1 * 10);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(15000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  await window.waitForTimeout(3000);
  await manualBarcode(dataset[4].itemBarcode);
  await window.waitForTimeout(4000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.locator('.item-type-normal').first().click();
  await changeQuantity('Add',20);
  await window.waitForTimeout(15000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  const itemWeight4 = parseFloat(dataset[4].itemWeight);
  weightCalc = weightCalc + (itemWeight4 * 21);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(3000);
  await window.locator('.item-type-normal').first().click();
  await changeQuantity('Remove',5);
  await window.waitForTimeout(3000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(3000);
  weightCalc= weightCalc - (itemWeight4 * 5);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  await window.waitForTimeout(3000);
  //
  await window.locator('ion-button').filter({ hasText: 'משקאות' }).locator('svg').click();
  await window.waitForTimeout(2000);
  await window.locator('ion-button').filter({ hasText: 'מים מינרלים גדול' }).locator('img').click();
  await window.waitForTimeout(4000);
  await window.locator('.item-type-normal').first().click();
  await window.waitForTimeout(4000);
  await changeQuantity('Add',20);
  await window.waitForTimeout(30000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  const itemWeight6 = parseFloat(dataset[6].itemWeight);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(3000)
  weightCalc = weightCalc + (itemWeight6 * 21);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(3000);

  //Remove Item dataset[6]
  await window.locator('.item-type-normal').first().click();
  await changeQuantity('Remove',10);
  await window.waitForTimeout(3000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(3000)
  weightCalc= weightCalc - (itemWeight6 * 10);
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(10000);
  await window.waitForSelector('#quantity', { state: 'hidden' });
  await window.waitForTimeout(4000);
  //

  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(2000)
  await scanBarcode(dataset[5].itemBarcode);
  await window.waitForTimeout(10000);
  const itemWeight5 = parseFloat(dataset[5].itemWeight);
  weightCalc = weightCalc + itemWeight5;
  await sendSecurityScale(weightCalc);
  await window.waitForTimeout(2000);
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(2000)
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(2000)
  weightCalc = weightCalc + ghostWeight;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(2000)


  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[5].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[5].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('כמות1');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[6].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText(dataset[6].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(2)')).toContainText('Caret UpCaret Down11');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(3)')).toContainText(dataset[6].promotion);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(4)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(4)')).toContainText(dataset[6].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(5)')).toContainText(dataset[4].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(5)')).toContainText(dataset[4].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(5)')).toContainText('Caret UpCaret Down16');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(6)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(6)')).toContainText(dataset[1].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(6)')).toContainText('Caret UpCaret Down11');

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(7)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(7)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(8)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(8)')).toContainText(dataset[1].promotion);

  await expect(window.locator('#main-basket-items-container > div > div:nth-child(9)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(9)')).toContainText(dataset[2].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(9)')).toContainText('Caret UpCaret Down11');

  await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪11.60' }).nth(1)).toBeVisible();
  await expect(window.getByRole('button', { name: 'תשלום (50 פריטים) ₪399.90' })).toBeVisible();
  await window.getByRole('contentinfo').getByText('₪399.90').click();
  await window.waitForTimeout(3000);

  await expect(window.getByText('50העגלה שלי')).toBeVisible();
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(dataset[5].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(1)')).toContainText(`X1 ${dataset[5].itemPrice}`);
  //
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(dataset[6].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(2)')).toContainText(`X11 ${dataset[6].itemPriceX11}`);

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(3)')).toContainText(dataset[6].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(4)')).toContainText(dataset[6].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(4)')).toContainText(dataset[6].promotion);

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(5)')).toContainText(dataset[4].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(5)')).toContainText(`X16 ${dataset[4].itemPriceX16}`);

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(6)')).toContainText(dataset[1].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(6)')).toContainText(`X11 ${dataset[1].itemPriceX11}`);

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(7)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(7)')).toContainText(dataset[1].promotion);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(8)')).toContainText(dataset[1].promotionName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(8)')).toContainText(dataset[1].promotion);

  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(9)')).toContainText(dataset[2].itemName);
  await expect(window.locator('#main > app-plastic-bag > app-main-content > div > div.is-rtl.side > app-minimal-basket > div > div.items > app-minimal-basket-item:nth-child(9)')).toContainText(`X11 ${dataset[2].itemPriceX11}`);
  // 
  await expect(window.getByText('חסכון (מבצעים והנחות) -₪11.60')).toBeVisible();
  await expect(window.getByText('סה"כ לתשלום ₪399.90')).toBeVisible();
  await expect(window.getByText('תשלום₪399.90')).toBeVisible();
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await buyBags('5');
  await window.waitForTimeout(5000);
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(5000);
  // weightCalc = weightCalc + ghostWeight1;
  // await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(10000);
  // await addWeightMessage();
  // await approveImbalance('placeWeight');
  await window.getByText('דילוג').click();
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await enterPhoneForReceipt('0545656468');
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(5000);
  // weightCalc = weightCalc + ghostWeight1;
  // await sendSecurityScale(weightCalc); //ghost weight
  // await window.waitForTimeout(5000);
  await expect(window.getByText('בחרו את אופן התשלום')).toBeVisible();
  await expect(window.locator('div').filter({ hasText: /^כרטיס אשראי$/ }).first()).toBeVisible();
  await expect(window.locator('div').filter({ hasText: /^תווי שי$/ }).first()).toBeVisible();
  await window.getByRole('img', { name: 'כרטיס אשראי' }).click();
  await expect(window.getByText('תשלום בכרטיס אשראי')).toBeVisible();
  await expect(window.getByText('העבירו את כרטיס האשראי במכשיר התשלום משמאלניתן לחזור לסל הקניות על ידי לחיצה על ')).toBeVisible();
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(30000);

  await expect(window.locator('app-payment-error div').nth(1)).toBeVisible();
  await expect(window.getByText('לא הצלחנו להתחבר למערכת התשלום')).toBeVisible();
  await expect(window.getByText('חיזרו לסל הקניות ונסו שנית או קראו לצוות התמיכה')).toBeVisible();
  await window.getByRole('button', { name: 'חזרה לסל' }).click();
  await window.waitForTimeout(3000);
  // await addWeightMessage();
  // await approveImbalance('placeWeight');
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[13].itemName);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText(dataset[13].itemPrice);
  await expect(window.locator('#main-basket-items-container > div > div:nth-child(1)')).toContainText('כמות5');

  await expect(window.locator('div').filter({ hasText: 'סה"כ חסכת₪11.60' }).nth(1)).toBeVisible();
  await expect(window.getByRole('button', { name: 'תשלום (55 פריטים) ₪400.40' })).toBeVisible();
  await window.getByRole('contentinfo').getByText('₪400.40').click();
  await window.waitForTimeout(2000);
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(5000);
  await buyBags('2');
  // weightCalc = weightCalc + ghostWeight1;
  // await sendSecurityScale(weightCalc); //ghost weight
  // await window.waitForTimeout(5000)
  // weightCalc = weightCalc + ghostWeight1;
  // await sendSecurityScale(weightCalc); //ghost weight
  // //await approveImbalance();
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(5000)
  await expect(window.getByText('בחרו את אופן התשלום')).toBeVisible();
  await expect(window.locator('div').filter({ hasText: /^כרטיס אשראי$/ }).first()).toBeVisible();
  await expect(window.locator('div').filter({ hasText: /^תווי שי$/ }).first()).toBeVisible();
  await window.getByRole('img', { name: 'כרטיס אשראי' }).click();
  await expect(window.getByText('תשלום בכרטיס אשראי')).toBeVisible();
  await expect(window.getByText('העבירו את כרטיס האשראי במכשיר התשלום משמאלניתן לחזור לסל הקניות על ידי לחיצה על ')).toBeVisible();
  weightCalc = weightCalc + ghostWeight1;
  await sendSecurityScale(weightCalc); //ghost weight
  await window.waitForTimeout(30000);

  await expect(window.locator('app-payment-error div').nth(1)).toBeVisible();
  await expect(window.getByText('לא הצלחנו להתחבר למערכת התשלום')).toBeVisible();
  await expect(window.getByText('חיזרו לסל הקניות ונסו שנית או קראו לצוות התמיכה')).toBeVisible();
  await window.getByRole('button', { name: 'חזרה לסל' }).click();
  // await addWeightMessage();
  // await approveImbalance('placeWeight');
  // Get journeyId
  const journeyId = await sendEventtoCMR();
  await addJourneyId(journeyId);
  console.log("Journey ID:", journeyId);
  //
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await voidTrs('OK','large');
  await sendSecurityScale(0.0);
  await window.waitForTimeout(50000);
}, 'test 29 - Adding Ghost Weight in CheckOut Screens',testInfo);
});