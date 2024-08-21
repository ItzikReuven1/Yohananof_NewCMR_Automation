import { scanAdminBarcode, scanBarcode, sendLegalScale, sendSecurityScale } from './scannerAndWeightUtils';
const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
import { incrementCounter,getCounter } from './testCounter';
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

////Void Transaction////
export const voidTrs = async (action,qty) => {
  const { window } = sharedContext;
  await expect(window.getByText('אפשרויות ניהול')).toBeVisible();
  await window.getByText('ביטול עסקה').click();
  await window.waitForTimeout(2000);
  await expect(window.getByText('ביטול עסקה').nth(1)).toBeVisible();
  await expect(window.getByText('שימו לב שהפריטים ימחקו ללא אפשרות שחזור')).toBeVisible();

  if (action === 'OK') {
    await window.getByRole('button', { name: 'אישור', exact: true }).click();
    await expect(window.getByText('מה הסיבה לביטול?')).toBeVisible();
    await expect(window.getByRole('button', { name: 'תקלת מערכת' })).toBeVisible();
    await expect(window.getByRole('button', { name: 'עגלה נטושה' })).toBeVisible();
    await expect(window.getByRole('button', { name: 'לצורך בדיקה' })).toBeVisible();
    await expect(window.getByRole('button', { name: 'אחר' })).toBeVisible();
    await window.getByRole('button', { name: 'תקלת מערכת' }).click();
    if(qty === 'large')
    {
      await window.waitForTimeout(130000);
    }
    //await expect(window.getByText('תהליך ביטול העסקה בוצע בהצלחה')).toBeVisible();
    await expect(window.getByText('העסקה בוטלה בהצלחה')).toBeVisible();
    await window.getByRole('button', { name: 'סגור' }).click();

  } else if (action === 'Cancel') {
    await window.getByRole('button', { name: 'ביטול' }).click();
  } 
};

////Get Help////
export const getHelp = async (help,cancel) => {
  const { window } = sharedContext;
  if (help === 'tohelp') {
    await window.getByText('לעזרה').click();
  } else {
    await window.getByRole('banner').getByText('עזרה').click();
  } 
  await window.waitForTimeout(2000);
  if (cancel === 'cancel') {
    await expect(window.locator('ion-button.active-support-call')).toBeVisible();
    await expect(window.getByText('קריאתך התקבלה')).toBeVisible();
    await expect(window.getByText('אפשר בינתיים להמשיך בקניות בקרבת מקום,כך שנוכל למצוא אותך בקלות')).toBeVisible();
    await expect(window.getByText('אם הסתדרת כבר, ניתן לבטל את הקריאה')).toBeVisible();
    await window.getByText('ביטול קריאה').click();
    await expect(window.getByText('הקריאה בוטלה בהצלחה')).toBeVisible();
    await expect(window.locator('ion-button.active-support-call')).toBeHidden();

  } else {
    await expect(window.getByText('אנחנו כאן כדי לסייע')).toBeVisible();
    await expect(window.getByText('ניתן לקרוא לעזרה וצוות התמיכה יגיע בהקדם')).toBeVisible();
    await window.getByText('קריאה לעזרה').click();
    await expect(window.getByText('קריאתך התקבלה')).toBeVisible();
    await expect(window.getByText('אפשר בינתיים להמשיך בקניות בקרבת מקום,כך שנוכל למצוא אותך בקלות')).toBeVisible();
    await expect(window.getByText('אם הסתדרת כבר, ניתן לבטל את הקריאה')).toBeVisible();
    await window.getByRole('button', { name: 'לחזור לסל הקניות' }).click();
    await expect(window.locator('ion-button.active-support-call')).toBeVisible();
  }

};

////Start Transaction////
export const startTrs = async (first,bagWeight,before) => {
  const { window } = sharedContext;
  await expect(window).toHaveTitle("Cust2mate");
  window.on('console', console.log);
  await expect(window.locator('#battery-status-container svg')).toBeVisible();
  await expect(window.getByText('עגלה חכמהבלי לעמוד בתור בקופה')).toBeVisible();
  await expect(window.locator('app-before-buying div').filter({ hasText: 'התשלום באשראי בלבד' }).nth(3)).toBeVisible();
  //console.log("getCounter is : " + getCounter());
  if (first === 1) {
  expect(await window.getByRole('img', { name: 'captured-image' }).screenshot()).toMatchSnapshot('Yohananof Logo.png');
  expect(await window.locator('app-header img').screenshot()).toMatchSnapshot('Yohananof Heaser Logo.png');
  }
  if (typeof bagWeight === 'number' && before === '1') {
    await sendSecurityScale(bagWeight);
      }
  await window.getByRole('button', { name: 'התחילו לקנות' }).click();
  await window.waitForTimeout(3000);
  await expect(window.getByText('הזינו את מספר הנייד להתחלה ולקבלת החשבונית')).toBeVisible();
  await expect(window.locator('app-terms-conditions div').filter({ hasText: 'קראתי ואני מסכימ/ה ל תנאי השימוש וגם מדיניות פרטיות' }).nth(3)).toBeVisible();
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await window.locator('app-manager-options').getByText('דילוג אימות מספר נייד').click();
  await window.waitForTimeout(2000);
  await expect(window.getByText('שלום')).toBeVisible();
  await expect(window.getByText('הניחו בעגלה חפצים אישיים ושקיות קניה לפני תחילת הקניות. שימו לב, לא ניתן להושיב ילדים בעגלה')).toBeVisible();
  if (typeof bagWeight === 'number' && before !== '1') {
  await sendSecurityScale(bagWeight);
    }
  await window.getByRole('button', { name: 'הנחתי. אפשר להתחיל' }).click();
  await window.waitForTimeout(3000);

  // if (getCounter() < 1) {
  // expect(await window.getByRole('banner').screenshot()).toMatchSnapshot('Yohananof Banner.png');
  // expect(await window.getByText('זה הזמן להתחיל לקנות!הפריטים שתוסיפו יופיעו באזור הזהסרקו את ברקוד הפריטאו השתמש').screenshot()).toMatchSnapshot('Yohananof Start Body.png');
  // expect(await window.getByRole('contentinfo').screenshot()).toMatchSnapshot('Yohananof Plu.png');
  // }
  // incrementCounter(); // Increment the test counter after each test
};

////Age Restriction////
export const ageRestriction = async () => {
  const { window } = sharedContext;
  await window.waitForTimeout(2000);
  await expect(window.getByText('חלק מהפריטים ממתינים לאישור')).toBeVisible();
  await expect(window.getByText('פנו בבקשה לצוות התמיכה להשלמת התהליך')).toBeVisible();
  await window.getByRole('button', { name: 'הבנתי, תודה' }).click();
  //await expect(window.getByText('צוות התמיכה יוודא את גילך לפני המעבר לתשלום. בינתיים ניתן להמשיך בקנייה.')).toBeVisible();
  await expect(window.getByText('צוות התמיכה יוודא את גילך לפני המעבר לתשלום. בינתיים ניתן להמשיך בקניה')).toBeVisible();
  await window.waitForTimeout(2000);
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  /////
  await expect(window.getByText('ישנם פריטים הממתינים לאישור גיל הקונה')).toBeVisible();
  await expect(window.getByText('יש לבדוק את גיל הקונה או להזין תאריך לידה')).toBeVisible();
  await window.getByRole('button', { name: 'מאושר' }).click();
  /////
  await window.waitForTimeout(2000);
  await expect(window.getByText('גיל הקונה מאושר')).toBeVisible();
  await expect(window.getByText('לסיום והוספת הפריטים לסל יש ללחוץ על אישור')).toBeVisible();
  await window.getByRole('button', { name: 'OK' }).click();
};

////Item Not Found////
export const itemNotFound = async (action) => {
  const { window } = sharedContext;
  await expect(window.getByText('לא זיהינו את הפריט')).toBeVisible();
  await expect(window.getByText('חפשו ברקוד נוסף על הפריט או קראו לעזרה')).toBeVisible();
  
  if (action === 'Help') {
    await window.getByRole('button', { name: 'help circle outline עזרה' }).click();
    await expect(window.getByText('מדיניות פרטיות')).toBeVisible();
    await expect(window.getByText('עגלה מספר 10029')).toBeVisible();
    await expect(window.getByText('אנחנו כאן כדי לסייע')).toBeVisible();
    await expect(window.getByText('השארו בקרבת מקום וצוות התמיכה יגיע אליכם בהקדם')).toBeVisible();
    await window.getByRole('button', { name: 'המשיכו בקניות' }).click();
  } else if (action === 'Back') {
    await window.getByRole('button', { name: 'help circle outline עזרה' }).click();
  } 
};

////Change Item Quantity////
export const changeQuantity = async (action,quantity) => {
  const { window } = sharedContext;
  //await expect(window.getByText('בחירת כמות חדשה')).toBeVisible();
  const addButton = await window.getByRole('img', { name: 'add' }).getByRole('img');
  const removeButton = await window.getByRole('img', { name: 'remove' }).getByRole('img');
  const button = action === 'Add' ? addButton : removeButton;

  for (let i = 0; i < quantity; i++) {
    await button.click();
  }

  await window.getByRole('button', { name: 'עדכון' }).click();
};

////Weight Change Message////
export const weightChange = async (action) => {
  const { window } = sharedContext;
  //await expect(window.getByRole('img', { name: 'help circle outline' }).locator('path').nth(1)).toBeVisible();
  await expect(window.getByText('בחרו את הפריט להסרה')).toBeVisible();
  await expect(window.getByText('הימנעו מלהישען על העגלה עד לקליטת המחיקה')).toBeVisible();
  await window.waitForTimeout(5000)
  await expect(window.getByRole('button', { name: 'לא רוצה למחוק' })).toBeVisible();
  
  if (action === 'Yes') {
    // await window.getByRole('button', { name: 'כן, רוצה למחוק' }).click();

  } else if (action === 'No') {
    await window.getByRole('button', { name: 'לא רוצה למחוק' }).click();
  } 
};

////Restore Message////
export const restoreMessage = async (action) => {
  const { window } = sharedContext;
  await window.waitForTimeout(3000);
  if (await window.locator('ion-label').filter({ hasText: /^שיחזור$/ }).isVisible())
  {
  await expect(window.getByText('נמצאה עסקה פעילה. האם לשחזר אותה?')).toBeVisible();

  if (action === 'OK') {
    await window.getByRole('button', { name: 'שיחזור' }).click();
  } else if (action === 'Cancel') {
    await window.getByRole('button', { name: 'ביטול' }).click();
  } 
}
};

////Restore Succcessful Message////
export const restoreSuccessful  = async () => {
  const { window } = sharedContext;
  await expect(window.locator('div').filter({ hasText: 'שיחזור' })).toBeVisible();
  await expect(window.getByText('שחזור הפריטים בוצע בהצלחה')).toBeVisible();
  await window.getByRole('button', { name: 'לחזור לסל הקניות' }).click();
 
};

////Change Price////
export const changePrice = async (barcode, productText, newPrice,weightableItem) => {
  const { window } = sharedContext;
  await window.getByText('שינוי מחיר').click();
  await expect(window.getByText('שינוי מחיר1חיפוש פריט2בחירת פריט3שינוי מחיר4סיום')).toBeVisible();
  //await expect(window.getByText('בחירת פריטסריקת ברקודהקלדת ברקוד בחרו מסל הקנייה')).toBeVisible();
  //await expect(window.getByText('בחירת פריטסריקת ברקודהקלדת ברקוד בחרו מסל הקנייה')).toBeVisible();
  await expect(window.locator('div').filter({ hasText: /^בחירת פריט$/ })).toBeVisible();
  await expect(window.getByText('סריקת ברקוד')).toBeVisible();
  await expect(window.getByRole('button', { name: 'הקלדת ברקוד' })).toBeVisible();
  await expect(window.getByRole('button', { name: 'בחרו מסל הקניה' })).toBeVisible();
  
  await expect(window.getByRole('button', { name: 'chevron back outline חזרה' })).toBeVisible();
  if (weightableItem === 'weightableItem')
  {
    await window.getByRole('button', { name: 'בחרו מסל הקניה' }).click();
    await window.getByRole('button', { name: 'בחירה' }).click();
  } else {
  await scanBarcode(barcode);
  }
  //await expect(window.getByText('שינוי מחירחיפוש פריטבחירת פריט3שינוי מחיר4סיום')).toBeVisible();
  await expect(window.locator('.item-line')).toContainText(productText);

  await expect(window.getByText('מחיר חדש ליח\' מידה')).toBeVisible();
  await expect(window.getByText('הנחה ליח\' מידה', { exact: true })).toBeVisible();
  await expect(window.getByText('% הנחה ליח\' מידה')).toBeVisible();
  await expect(window.getByRole('button', { name: 'chevron back outline חזרה' })).toBeVisible();
  await window.locator("xpath=/html/body/app-root/ion-app/ion-modal/app-price-override/div/div[1]/div/div/div[2]/div[1]/ion-button").click();

  for (let digit of newPrice) {
    await window.getByRole('button', { name: digit }).click();
  }

  await window.locator('.number-bottom > ion-button:nth-child(3) > .button-native').click();
  const formattedNumber = (newPrice / 100).toFixed(2);
  //await expect(window.locator('.item-line')).toContainText(formattedNumber);
  await window.getByText('₪${formattedNumber}').first();
  await window.getByRole('button', { name: 'עדכון וסיום' }).click();
  await expect(window.getByText('המחיר עודכן בהצלחהלחצו על "המשיכו בקניות" לחזור לסל')).toBeVisible();
  await window.getByRole('button', { name: 'לחזור לסל הקניות' }).click();
};

////Weight Mismatch////
export const weightMismatch  = async (remove) => {
  const { window } = sharedContext;
  if (remove == 'Remove') {
    await expect(window.getByText('הפריט שרציתם להסיר אינו תואם את הפריט שהוצא מהעגלה.>br')).toBeVisible();
    await expect(window.locator('app-alert-location-embedded div').filter({ hasText: 'Alert Circle' }).nth(1)).toBeVisible();
  } else {
    await expect(window.locator('#basket div').filter({ hasText: 'הפריט שהונח אינו תואם לפריט שניסיתם להוסיף.הוציאו את הפריט שהונח, והניחו במקומו ' }).nth(1)).toBeVisible();
    //await expect(window.getByText('הכניסו את הפריט לעגלה')).toBeVisible();
    await expect(window.getByRole('button', { name: 'ביטול הוספה' })).toBeVisible(); 
  }
};

////Manual Barcode////
export const manualBarcode = async (barcode) => {
  const { window } = sharedContext;
  await window.locator('div').filter({ hasText: 'הזנת ברקוד' }).nth(3).click();
  await window.waitForTimeout(3000);

  for (let digit of barcode) {
    await window.getByRole('button', { name: digit }).click();
  }

  await window.getByText('הוספה').click();
};

////Buy Bags////
export const buyBags = async (Qty) => {
  const { window } = sharedContext;
  await expect(window.getByText('האם תרצו לרכוש שקיות?')).toBeVisible();
  await expect(window.getByText('בחרו את כמות השקיות הרצויה')).toBeVisible();
  //await expect(window.getByText('[₪0.10 ליחידה]')).toBeVisible();
 
  for (let digit of Qty) {
    await window.getByRole('button', { name: digit }).click();
  }

  await window.getByText('המשך').click();
};

////Cart Lock////
export const cartLock  = async () => {
  const { window } = sharedContext;
  await scanAdminBarcode();
  await window.locator('ion-toggle').click();
  await window.waitForTimeout(2000);
  await expect(window.getByText('זמנית העגלה לא יכולה להצטרף למסע הקניות אנא פנו לנציג השרות לקבלת עזרה')).toBeVisible();
 
};

////Cart Unlock////
export const cartUnlock  = async () => {
  const { window } = sharedContext;
  await expect(window.getByText('זמנית העגלה לא יכולה להצטרף למסע הקניות אנא פנו לנציג השרות לקבלת עזרה')).toBeVisible();
  await scanAdminBarcode();
  await window.locator('ion-toggle').click();
  await window.waitForTimeout(2000);
  await expect(window.getByRole('button', { name: 'התחילו לקנות' })).toBeVisible();
 
};

////Add Weight change message////
export const addWeightMessage  = async (info,help) => {
  const { window } = sharedContext;
  await expect(window.getByText('האם הוספתם פריטים לעגלה?')).toBeVisible();
  await expect(window.getByText('בדקו במסך מהו הפריט האחרון שנקלטסרקו שוב את הפריטים שהוכנסו אחריו')).toBeVisible();
  await expect(window.getByRole('img', { name: 'scanner' })).toBeVisible();
  await expect(window.getByText('במקרה והבעיה נמשכת - יש לקרוא לעזרה')).toBeVisible();
  await window.waitForTimeout(5000);

  if (info === 'noAdded') {
  await window.getByRole('button', { name: 'לא הוספתי כלום' }).click();
  } else { 
    await expect(window.getByRole('button', { name: 'לא הוספתי כלום' })).toBeHidden();
  }

  if (help === 'Help') {
   await getHelp('tohelp');
  }

};


////Weighable Item////
export const weightableItem  = async (itemName,itemPrice,itemWeight,status,itemBarcode,scan,itemNetWeight,itemPackWeight) => {
  const { window } = sharedContext;
  if (scan === 'scan') {
    await scanBarcode(itemBarcode);
  } else {
    await window.locator('ion-button').filter({ hasText: `${itemName}`}).locator('img').click();
  }
  await expect(window.locator("xpath=/html/body/app-root/ion-app/ion-modal/app-plu-item/div/div[1]").getByText(itemName)).toBeVisible();
  await expect(window.getByText('Alert Circleהניחו את הפריט על המשקל')).toBeVisible();
  await expect(window.locator('.message-insert-init').first()).toBeVisible();
  await expect(window.locator("xpath=/html/body/app-root/ion-app/ion-modal/app-plu-item/div/div[2]/app-plu-legal-scale/div/div[1]")).toContainText(itemPrice);
  await sendLegalScale(itemWeight);
  if ( itemNetWeight !== null) {
    await expect(window.locator('#scale-available').getByText(`${itemNetWeight}`)).toBeVisible(); 
    await expect(window.locator('#scale-available').getByText('משקל אריזה:')).toBeVisible();
    await expect(window.locator('#scale-available').getByText(`${itemPackWeight}`)).toBeVisible();
  } else {
    await expect(window.locator('#scale-available').getByText(`${itemWeight}`)).toBeVisible(); 
  }
  if (status === 'cancel') {
    await window.getByRole('button', { name: 'ביטול' }).click();
  }
  else
  {
  await window.getByText('אשרו והעבירו לעגלה').click();
  await sendLegalScale(0.00);
  }
};

////Personal Bag message////
export const personalBagMessage  = async (cont) => {
  const { window } = sharedContext;
  await expect(window.getByRole('img', { name: 'Help Circle', exact: true })).toBeVisible();
  await expect(window.getByText('האם הסרתם חפצים אישיים?')).toBeVisible();
  await expect(window.getByText('אתם יכולים להחזיר את החפצים האישיים לעגלה, או ללחוץ כדי להמשיך בלעדיהם')).toBeVisible();
  await expect(window.getByRole('button', { name: 'להמשיך בלעדיהם' })).toBeVisible();
  if (cont === 'Ok') {
    await window.getByRole('button', { name: 'להמשיך בלעדיהם' }).click();
   }

};

////Import Transaction////
export const importTrs = async (store) => {
  const { window } = sharedContext;
  await window.getByText('ייבוא עסקה').click();
  await expect(window.getByText('Closeייבוא עסקה')).toBeVisible();
  await expect(window.getByText('יש להקיש את מספר העגלה התקולה ולאחר מכן את מספר הסניף')).toBeVisible();
  //await window.locator("xpath=/html/body/app-root/ion-app/ion-modal[2]/app-process-modal/div/div/div/app-process-type-barcode/app-digit-keyboard/div/div/div[2]").getByText('1').click();
  for (let digit of store) {
    if (digit === '1'){
      await window.locator("xpath=/html/body/app-root/ion-app/ion-modal[2]/app-process-modal/div/div/div/app-process-type-barcode/app-digit-keyboard/div/div/div[2]").getByText('1').click();
    } else {
    await window.getByRole('button', { name: digit }).click();}
  }
  // await window.getByRole('button', { name: '0' }).click();
  // await window.getByRole('button', { name: '0' }).click();
  // await window.getByRole('button', { name: '2' }).click();
  // await window.getByRole('button', { name: '9' }).click();
  await window.getByText('המשך').click();
};

////Approve imbalance////
export const approveImbalance = async (placeWeight) => {
  const { window } = sharedContext;
  if (placeWeight==='placeWeight') {
    //
  } else {
    await expect(window.getByText('Alert Circleהפריט שהונח אינו תואם לפריט שניסיתם להוסיף.הוציאו את הפריט שהונח, והניחו במקומו את הפריט שסרקתם או בחרתם')).toBeVisible();
  }
  //await expect(window.getByText('Alert Circleהפריט שהונח אינו תואם לפריט שניסיתם להוסיף.הוציאו את הפריט שהונח, והניחו במקומו את הפריט שסרקתם או בחרתם')).toBeVisible();
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await window.getByText('אישור חוסר איזון בעגלה').click();
  await window.waitForTimeout(2000);
};

////Enter Phone Number For Receipt////
export const enterPhoneForReceipt = async (phone) => {
  const { window } = sharedContext;
  await expect(window.getByText('לקבלת החשבוניתאשרו או הזינו מספר נייד אחר')).toBeVisible();
  for (let digit of phone) {
    await window.getByRole('button', { name: digit }).click();
  }
  await window.locator('.phone-number-keyboard > .main > .keyboard-header > .number-bottom > ion-button:nth-child(3) > .button-native').click();
  await window.waitForTimeout(2000);
};

////Payment screen////
export const paymentScreen  = async (payment,number) => {
  const { window } = sharedContext;
  await expect(window.getByText('בחרו את אופן התשלום')).toBeVisible();
  await expect(window.locator('div').filter({ hasText: /^כרטיס אשראי$/ }).first()).toBeVisible();
  await expect(window.locator('div').filter({ hasText: /^תווי שי$/ }).first()).toBeVisible();
  if (payment==='credit')
  {
  await window.getByRole('img', { name: 'כרטיס אשראי' }).click();
  await expect(window.getByText('תשלום בכרטיס אשראי')).toBeVisible();
  await expect(window.getByText('העבירו את כרטיס האשראי במכשיר התשלום משמאלניתן לחזור לסל הקניות על ידי לחיצה על ')).toBeVisible();
  await window.waitForTimeout(30000);
  await expect(window.locator('app-payment-error div').nth(1)).toBeVisible();
  await expect(window.getByText('לא הצלחנו להתחבר למערכת התשלום')).toBeVisible();
  await expect(window.getByText('חיזרו לסל הקניות ונסו שנית או קראו לצוות התמיכה')).toBeVisible();
  await window.getByRole('button', { name: 'חזרה לסל' }).click();
  await window.waitForTimeout(2000);
  }
  if (payment==='giftcard')
  {
  await window.getByRole('img', { name: 'כרטיס מתנה' }).click();
  await expect(window.getByText('למימוש תווי השי יש לבחור את דרך ההזנה')).toBeVisible();
  await expect(window.getByText('יש לסרוק או להקליד את מספר תו השי')).toBeVisible();
  await expect(window.getByText('העברה של תו השי במסוף')).toBeVisible();
  await window.getByText('יש לסרוק או להקליד את מספר תו השי').click();
  expect(await window.locator('app-type-gift-card-number').screenshot()).toMatchSnapshot('giftCard.png');
  await scanBarcode(number);
  await window.waitForTimeout(5000);
  };
};


export const endShopping = async () => {
  const { window } = sharedContext;
  await expect(window.getByText('התשלום הסתיים')).toBeVisible();
  await expect(window.getByRole('heading', { name: 'תודה שקניתם אצלנו' })).toBeVisible();
  await expect(window.getByRole('heading', { name: 'קבלה דיגיטלית נשלחה לנייד בהודעת סמס' })).toBeVisible();
  await expect(window.getByRole('heading', { name: 'נא להחזיר את העגלה למתחם העגלות החכמות' })).toBeVisible();
  };
