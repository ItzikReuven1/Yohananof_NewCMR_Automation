const { request } = require('@playwright/test');
const dataset = JSON.parse(JSON.stringify(require("./Utils/Yohananof_TestData.json")));
import fs from 'fs';

//let journeyIds = [];

////Send event to CMR////
//  export const sendEventtoCMR= async () => {
//     const sendEvent = {
//       cartID:"64bf9960e154fc0008cb5992",
//       name:"getCartTransaction",
//       eventData:""
//     };
//     const apiContext = await request.newContext();
//     const response = await apiContext.post("http://localhost:770/api/v1/cart/sendEvent", {
//     data: sendEvent,
//    });

//     const responseData = await response.json();
//     const journeyId = responseData.data.journeyId;
//     return journeyId;
// };

export const sendEventtoCMR = async () => {
  const sendEvent = {
      cartID: "64bf9960e154fc0008cb5992",
      name: "getCartTransaction",
      eventData: ""
  };
  
  try {
      const apiContext = await request.newContext();
      const response = await apiContext.post("http://localhost:770/api/v1/cart/sendEvent", {
          data: sendEvent,
      });

      // Check if the response is okay (status code 2xx)
      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Log the entire response data
      console.log(responseData);

      // Check if the response data contains the expected structure
      if (responseData && responseData.data && responseData.data.journeyId) {
          const journeyId = responseData.data.journeyId;
          return journeyId;
      } else {
          throw new Error('Invalid response structure');
      }
  } catch (error) {
      console.error('Error sending event to CMR:', error);
      // Depending on your requirements, you can rethrow the error or return a default value
      throw error;
  }
};


  
//export const approveImbalance = async (placeWeight) => {

export const addJourneyId = async(journeyId) => {
  //journeyIds.push(journeyId);
  saveJourneyIdsToFile(journeyId);
};

// export const getJourneyIds = async() => {
//   return journeyIds;
// };

const saveJourneyIdsToFile = async (journeyId) => {
  try {
    const data = JSON.stringify(journeyId);
    await fs.appendFileSync('journeyIds.json', data + '\n');
  } catch (err) {
    console.error('Error saving journeyIds to file:', err);
  }
};

export const loadJourneyIdsFromFile = async() => {
  try {
    const data = fs.readFileSync('journeyIds.json', 'utf8');
    journeyIds = JSON.parse(data);
  } catch (err) {
    console.error('Error loading journeyIds from file:', err);
  }
};

export const deleteJourneyIdsFile = async () => {
  try {
    fs.unlinkSync('journeyIds.json');
    console.log('journeyIds.json file deleted successfully.');
  } catch (err) {
    console.error('Error deleting journeyIds.json file:', err);
  }
};