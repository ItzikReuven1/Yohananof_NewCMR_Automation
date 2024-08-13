// Import necessary modules
const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const { setupElectron, teardownElectron, sharedContext } = require('./electronSetup1');
const mongoose = require('mongoose');
import fs from 'fs';

// Define the MongoDB connection URI
const mongoURI = 'mongodb+srv://Itzik:Itzik12345!@test-stg.w3ecl.mongodb.net/data-center-client-stg';

// Export the function for use in other files
export const getOrders = async (journeyIds) => {
    const { window } = sharedContext;
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

         // Define the schema for the cartItem
const cartItemSchema = new mongoose.Schema({
    createTime: Number,
    scannedBarcode: String,
    barcode: String,
    name: {
      default: String,
      heIL: String
    },
    itemStatus: String,
    lineType: String,
    ageRestrictionStatus: Number,
    quantity: Number,
    isWeighable: Boolean,
    actualWeight: Number,
    imageUrl: String,
    updateTimeStamp: Number,
    cartItemUUID: String,
    pclrItemUUID: String,
    itemGuid: String,
    isLightWeightItem: Boolean,
    shouldNotExpectWeight: Boolean,
    isQuantity: Boolean,
    allowQtyChange: Boolean,
    forcedAdd: Boolean,
    allergens: [String],
    tare: Number,
    barcodeSource: String,
    wasPluTriggeredItemAdd: Boolean,
    dbWeight: Number,
    isRestored: Boolean,
    isScannedOffline: Boolean
  });
  
  // Define the schema for the pclrItem
  const pclrItemSchema = new mongoose.Schema({
    barcode: String,
    name: {
      default: String,
      heIL: String
    },
    quantity: Number,
    updatedAt: Date,
    totalPrice: Number,
    unitPrice: Number,
    itemNumber: Number,
    discounts: [String],
    isInStore: Boolean,
    ageRestriction: Boolean,
    haveRecordedWeight: Boolean,
    pclrItemUUID: String,
    cartItemUUID: String
  });
  
  // Define the schema for Items array
  const itemSchema = new mongoose.Schema({
    cartItem: cartItemSchema,
    pclrItem: pclrItemSchema
  });
  
  // Define the schema for ghostWeights
  const ghostWeightSchema = new mongoose.Schema({
    weight: Number,
    step: String,
    timeStamp: Number,
    location: String,
    status: {
      approved: Number,
      lastUpdateBy: String
    }
  });
  
  // Define the schema for supportRequests
  const supportRequestSchema = new mongoose.Schema({
    callTimeStamp: Number,
    status: Number,
    timeStamp: Number,
    message: {
      location: {
        description: String
      },
      comment: String,
      sourceType: Number,
      journeyId: String
    },
    supportType: String,
    data: {
      state: String,
      receiptDestination: String,
      extraData: String
    }
  });
  
  // Define the schema for userJourney
  const userJourneySchema = new mongoose.Schema({
    timeStamp: Number,
    newStep: String,
    location: String,
    newState: String,
    stateData: {
      activeStep: String,
      forceChange: Boolean,
      restore: Boolean,
      currentCartWeight: {
        cartWeight: Number,
        unaccountedWeight: Number,
        ghostWeight: Number
      }
    }
  });
  
  // Define the schema for managerMenu
  const managerMenuSchema = new mongoose.Schema({
    managerUser: String,
    data: {
      cartID: String,
      eventName: String,
      socketID: String,
      eventData: {
        journeyId: String,
        eventName: String,
        data: {
          state: String,
          start: Boolean
        }
      },
      state: String
    },
    managerMode: String,
    info: {
      timeStamp: Number
    }
  });
  
  // Define the schema for the "transaction" collection
  const transactionSchema = new mongoose.Schema({
    Items: [itemSchema],
    weightMismatchErrors: [String],
    ghostWeights: [ghostWeightSchema],
    supportRequests: [supportRequestSchema],
    basketDiscounts: [String],
    basketCoupons: [String],
    basketLinkedItems: [String],
    itemExceptions: [String],
    acceptedPayments: [String],
    userJourney: [userJourneySchema],
    managerMenu: [managerMenuSchema]
  });
  
   // Create the model for the "transactions" collection
  const Transaction = mongoose.model('transactions', transactionSchema);


        for (const journeyId of journeyIds) {
            const trimmedJourneyId = journeyId.trim().replaceAll('"', ''); // Trim to remove any whitespace
            console.log('Processing journey ID:', trimmedJourneyId);

            // Find the document with the current journeyId
        const order = await Transaction.findOne({ journeyId: trimmedJourneyId });
        console.log('MongoDB query:', { journeyId: trimmedJourneyId });
        console.log('Order found:', order);

        if (order) {
            console.log('Order found:', order);

            // Generate report in JSON format
            const reportData = {
                orderId: order._id,
                products: order.Items.map(item => ({
                    cartItem: item.cartItem,
                    pclrItem: item.pclrItem
                })),
                cartNum: order.cartNum,
                storeNum: order.storeNum,
                sumOfBuy: order.sumOfBuy,
                startOfbuy: order.startOfbuy,
                journeyId: order.journeyId,
                weightMismatchErrors: order.weightMismatchErrors,
                ghostWeights: order.ghostWeights,
                supportRequests: order.supportRequests,
                basketDiscounts: order.basketDiscounts,
                basketCoupons: order.basketCoupons,
                basketLinkedItems: order.basketLinkedItems,
                itemExceptions: order.itemExceptions,
                acceptedPayments: order.acceptedPayments,
                userJourney: order.userJourney,
                managerMenu: order.managerMenu
                // Add other fields as needed
            };

            // Write report data to JSON file
            // fs.writeFileSync('order_report.json', JSON.stringify(reportData, null, 2));
            // console.log('Report generated: order_report.json');

            // Append report data to JSON file
            await fs.appendFileSync('order_report.json', JSON.stringify(reportData, null, 2) + '\n');
            console.log('Report appended to order_report.json for journeyId:', journeyId.trim());
        } else {
            console.log('Order not found for journeyId:', journeyId.trim());
        }
    } }catch (error) {
        console.error('Error finding order:', error);
    }
    finally {
        // Close the MongoDB connection
        await mongoose.disconnect();
        console.log('MongoDB connection closed');
    }
};

// Function to delete the 'order_report.json' file

export const deleteOrderReportFile = async() => {
    try {
        fs.unlinkSync('order_report.json');
        console.log('Order report file deleted successfully');
    } catch (error) {
        console.error('Error deleting order report file:', error);
    }
};