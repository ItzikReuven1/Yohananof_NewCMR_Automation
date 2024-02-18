const { request } = require('@playwright/test');
//Json->string->js object
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));

////Scanner Simualtor////
export const scanBarcode = async (barcode) => {
    const apiContext = await request.newContext();
    apiContext.post("http://localhost:772/simulator/barcode", {
      data: { barcode },
    });
  };

  ////Security Scale Simualtor////
  export const sendSecurityScale = async (weight) => {
    const securityScale = {
      // weight : weight.toString(),
      weight : parseFloat(weight),
      isStable : true,
      isOverloaded : false,
      isNewStableValue : true,
      device :"SECURITY_SCALE"
    };
    const apiContext = await request.newContext();
    await apiContext.post("http://localhost:772/simulator/scale", {
      data: securityScale,
    });
  };
  
  ////Scan Admin Daily Barcode////
  export const scanAdminBarcode = async () => {
    const scanBarcode = {barcode: dataset[0].dailyBarcode};
    const apiContext = await request.newContext();
    apiContext.post("http://localhost:772/simulator/barcode", {
      data: scanBarcode,
    });
  };

  //Legal Scale Simualtor////
  export const sendLegalScale = async (weight) => {
    const legalScale = {
      weight : parseFloat(weight),
      isStable : true,
      isOverloaded : false,
      isNewStableValue : true,
      device :"LEGAL_SCALE"
    };
    const apiContext = await request.newContext();
    await apiContext.post("http://localhost:772/simulator/scale", {
      data: legalScale,
    });
  };

    ////Legal Scale Simualtor Device-Status////
    export const LegalScale_Status = async () => {
      const legalScaleStatus = {
        device :"LEGAL_SCALE",
        status : "OK"
      };
      const apiContext = await request.newContext();
      await apiContext.post("http://localhost:772/simulator/device-status", {
        data: legalScaleStatus,
      });
    };



    ////Security Scale Simualtor Device-Status////
    export const SecurityScale_Status = async () => {
      const securityScaleStatus = {
        device :"SECURITY_SCALE",
        status : "OK"
      };
      const apiContext = await request.newContext();
      await apiContext.post("http://localhost:772/simulator/device-status", {
        data: securityScaleStatus,
      });
    };

    ////Battery Status Device-Status////
    export const Battery_Status = async () => {
      const batteryStatus = {
        chargingStatus: '5',
        chargerStatus: '5',
        batteryStatus : '5'
      };
      const apiContext = await request.newContext();
      await apiContext.post("http://localhost:772/simulator/battery", {
        data: batteryStatus,
      });
    };