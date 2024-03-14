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
    await window.getByRole('button', { name: 'אישור' }).click();
    await expect(window.getByText('מה הסיבה לביטול?')).toBeVisible();
    await expect(window.getByRole('button', { name: 'תקלת מערכת' })).toBeVisible();
    await expect(window.getByRole('button', { name: 'עגלה נטושה' })).toBeVisible();
    await expect(window.getByRole('button', { name: 'לצורך בדיקה' })).toBeVisible();
    await expect(window.getByRole('button', { name: 'אחר' })).toBeVisible();
    await window.getByRole('button', { name: 'תקלת מערכת' }).click();
    if(qty === 'large')
    {
      await window.waitForTimeout(90000);
    }
    await expect(window.getByText('תהליך ביטול העסקה בוצע בהצלחה')).toBeVisible();
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
    await window.getByRole('button', { name: 'המשיכו בקניות' }).click();
    await expect(window.locator('ion-button.active-support-call')).toBeVisible();
  }

};

////Start Transaction////
export const startTrs = async (first,bagWeight,before) => {
  const { window } = sharedContext;
  await expect(window).toHaveTitle("Cust2mate");
  // Direct Electron console to Node terminal.
  window.on('console', console.log);
  // await window.getByText('EN').click();
  // await window.waitForTimeout(2000);
  // await window.getByText('he', { exact: true }).click();
  // await window.waitForTimeout(2000);
  //await expect(window.getByText('en')).toBeVisible();
  await expect(window.locator('#battery-status-container svg')).toBeVisible();
  //await expect(window.getByText('ברוכים הבאים')).toBeVisible();
  //await expect(window.getByText('מגדירים מחדש את עתיד הקניות')).toBeVisible();
  //await expect(window.getByText('Cash payment is not permitted in the smart cart')).toBeVisible();
  console.log("getCounter is : " + getCounter());
  // if (first === 1) {
  // //expect(await window.getByRole('img', { name: '#' }).screenshot()).toMatchSnapshot('Yohananof Logo.png');
  // expect(await window.getByRole('img', { name: 'captured-image' }).first().screenshot()).toMatchSnapshot('Yohananof Logo.png');
  // }
  if (typeof bagWeight === 'number' && before === '1') {
    await sendSecurityScale(bagWeight);
      }
  await window.getByRole('button', { name: 'התחילו לקנות' }).click();
  await window.waitForTimeout(3000);
  //await expect(window.getByText('הזינו מספר נייד או מועדון להתחלה')).toBeVisible();
  //await expect(window.getByText('סרקו את כרטיס המועדון שלכם')).toBeVisible();
  //await expect(window.locator('app-terms-conditions div').filter({ hasText: 'קראתי ואני מסכימ/ה ל תנאי השימוש וגם מדיניות פרטיות' }).nth(3)).toBeVisible();
  await scanAdminBarcode();
  await window.waitForTimeout(2000);
  await window.locator('app-manager-options').getByText('דילוג אימות מספר נייד').click();
  await window.waitForTimeout(2000);
  await expect(window.getByText('היי,')).toBeVisible();
  //await expect(window.getByText('הניחו בעגלה חפצים אישיים ושקיות קנייה לפני תחילת הקניות. שימו לב, לא ניתן להושיב ילדים בעגלה!')).toBeVisible();
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
  await expect(window.getByText('צוות התמיכה יוודא את גילך לפני המעבר לתשלום. בינתיים ניתן להמשיך בקנייה.')).toBeVisible();
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
  await expect(window.getByText('חפשו ברקוד נוסף על המוצר או קראו לעזרה')).toBeVisible();
  
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
  await expect(window.getByText('להסרה, יש לבחור את הפריט הרצוי')).toBeVisible();
  //await expect(window.getByText('רוצה למחוק פריט מסל הקניות?')).toBeVisible();
  
  if (action === 'Yes') {
    // await window.getByRole('button', { name: 'כן, רוצה למחוק' }).click();
    // await expect(window.getByText('בחרו את הפריט שתרצו להסיר')).toBeVisible();
    // await expect(window.getByText('להסרה, סרקו הפריט או לחצו על')).toBeVisible();
    // await expect(window.getByRole('button', { name: 'chevron forward outline חזרה' })).toBeVisible();
  } else if (action === 'No') {
    await window.getByRole('button', { name: 'לא רוצה למחוק' }).click();
  } 
};

////Restore Message////
export const restoreMessage = async (action) => {
  const { window } = sharedContext;
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
  await window.getByRole('button', { name: 'המשיכו בקניות' }).click();
 
};

////Change Price////
export const changePrice = async (barcode, productText, newPrice,weightableItem) => {
  const { window } = sharedContext;
  await window.getByText('שינוי מחיר').click();
  await expect(window.getByText('שינוי מחיר1חיפוש פריט2בחירת פריט3שינוי מחיר4סיום')).toBeVisible();
  await expect(window.getByText('בחירת פריטסריקת ברקודהקלדת ברקוד בחרו מסל הקנייה')).toBeVisible();
  await expect(window.getByRole('button', { name: 'chevron back outline חזרה' })).toBeVisible();
  if (weightableItem === 'weightableItem')
  {
    await window.getByRole('button', { name: 'בחרו מסל הקנייה' }).click();
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
  await window.getByRole('button', { name: 'המשיכו בקניות' }).click();
};

////Weight Mismatch////
export const weightMismatch  = async () => {
  const { window } = sharedContext;
  await expect(window.locator('#basket div').filter({ hasText: 'המוצר שהונח אינו תואם למוצר שניסיתם להוסיף.הוציאו את הפריט שהונח, והניחו במקומו ' }).nth(1)).toBeVisible();
  //await expect(window.getByText('הכניסו את הפריט לעגלה')).toBeVisible();
  await expect(window.getByRole('button', { name: 'ביטול הוספה' })).toBeVisible();
 
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
  //await expect(window.getByText('שמנו לב לשינוי במשקל העגלה')).toBeVisible();
  await expect(window.getByText('יש להוציא את הפריט האחרון')).toBeVisible();
  await expect(window.getByRole('img', { name: 'scanner' })).toBeVisible();
  await expect(window.getByText('במקרה והבעיה נמשכת - יש לקרוא לעזרה')).toBeVisible();

  // if (info === 'Info') {
  //   await window.getByRole('button', { name: 'help circle outline להסבר אודות הוספת פריט' }).click();
  //   expect(await window.locator('#overWeight > app-process-modal > div').screenshot()).toMatchSnapshot('How_To_Add_Item.png');
  //   await window.getByRole('button', { name: 'chevron forward outline חזרה' }).click();
  // }

  if (help === 'Help') {
   await getHelp('tohelp');
  }

};


////Weighable Item////
export const weightableItem  = async (itemName,itemPrice,itemWeight,status) => {
  const { window } = sharedContext;
  await window.locator('ion-button').filter({ hasText: `${itemName}`}).locator('img').click();
  await expect(window.locator("xpath=/html/body/app-root/ion-app/ion-modal/app-plu-item/div/div[1]").getByText(itemName)).toBeVisible();
  await expect(window.getByText('Alert Circleהניחו את הפריט על המשקל')).toBeVisible();
  await expect(window.locator('.message-insert-init').first()).toBeVisible();
  await expect(window.locator("xpath=/html/body/app-root/ion-app/ion-modal/app-plu-item/div/div[2]/app-plu-legal-scale/div/div[1]")).toContainText(itemPrice);
  await sendLegalScale(itemWeight);
  await expect(window.locator('#scale-available').getByText(`${itemWeight}`)).toBeVisible();
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
  await expect(window.getByText('יש להחזיר את החפצים האישיים לעגלה, או ללחוץ להמשיך בלעדיהם')).toBeVisible();
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
  await expect(window.getByText('הזינו את מספר הקופה או עגלה בה נוצרה העסקה שתרצו לשחזר')).toBeVisible();
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