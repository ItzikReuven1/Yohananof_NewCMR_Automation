import { Battery_Status, LegalScale_Status, SecurityScale_Status } from './scannerAndWeightUtils';

const { _electron: electron } = require('@playwright/test');
const { exec } = require('child_process');


let sharedContext = {};

export const setupElectron = async () => {
  if (!sharedContext.electronApp) {
    
    //Run the batch file using the child_process.exec function
    exec('C:\\Cust2Mate\\Support\\C2M_Reload.bat', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running batch file: ${error}`);
        return;
      }
      console.log(`Batch file output: ${stdout}`);
    });

    //Wait for the batch file to finish executing (if necessary)
    await new Promise((resolve) => {
    // Replace '4000' with an appropriate value to wait for the batch file to finish executing
      setTimeout(resolve, 40000);
    });
 
    // Launch Electron
    sharedContext.electronApp = await electron.launch({
      executablePath: 'C:\\Program Files\\cust2mate\\cust2mate.exe',
      args: ['main.js'],
      headless: false,
      recordVideo: {
      dir: './videos', // Specify the directory to save the videos
      //   //size: { width: 640, height: 480 }
       },
    });
    const appPath = await sharedContext.electronApp.evaluate(async ({ app }) => {
      // This runs in the main Electron process, parameter here is always
      // the result of the require('electron') in the main app script.
      return app.getAppPath();
    });
    console.log(appPath);

    sharedContext.window = await sharedContext.electronApp.firstWindow();
    await sharedContext.window.waitForTimeout(5000);
    await LegalScale_Status();
    await SecurityScale_Status();
    await Battery_Status();
    await sharedContext.window.waitForLoadState('domcontentloaded');
  }
};
///////////////////////////////////

export const teardownElectron = async () => {
  // Do not close the Electron application if it is already running
  if (sharedContext.electronApp) {
    await sharedContext.electronApp.close();
  }

  // Run the batch file to stop Electron
  exec('C:\\Cust2Mate\\Support\\C2M_Stop.bat', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running batch file: ${error}`);
      return;
    }
    console.log(`Batch file output: ${stdout}`);
  });

  sharedContext.electronApp = null;

  // Wait for a brief moment before setting up Electron again
  await new Promise((resolve) => setTimeout(resolve, 5000));


};


export { sharedContext };


