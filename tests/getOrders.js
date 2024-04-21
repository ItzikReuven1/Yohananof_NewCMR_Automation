// Import necessary modules
const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const mongoose = require('mongoose');
const fs = require('fs');

// Define the MongoDB connection URI
const mongoURI = 'mongodb+srv://Itzik:Itzik12345!@test-stg.w3ecl.mongodb.net/data-center-client-stg';

// Export the function for use in other files
module.exports.getOrders = async function(journeyId){
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Define the schema for the "orders" collection
        const orderSchema = new mongoose.Schema({
            products: [{
                name: String,
                unitPrice: Number,
                // Add other fields as needed
            }],
            cartNum: Number,
            storeNum: Number,
            sumOfBuy: Number,
            startOfbuy: Date, // Assuming startOfbuy is a Date object
            journeyId: String,
            // Add other fields as needed
        });

        // Create the model for the "orders" collection
        const Order = mongoose.model('Order', orderSchema);

        // Find the document with the provided journeyId
        const order = await Order.findOne({ journeyId });

        if (order) {
            console.log('Order found:', order);

            // Generate report in JSON format
            const reportData = {
                orderId: order._id,
                products: order.products,
                cartNum: order.cartNum,
                storeNum: order.storeNum,
                sumOfBuy: order.sumOfBuy,
                startOfbuy: order.startOfbuy,
                journeyId: order.journeyId,
                // Add other fields as needed
            };

            // Write report data to JSON file
            // fs.writeFileSync('order_report.json', JSON.stringify(reportData, null, 2));
            // console.log('Report generated: order_report.json');

            // Append report data to JSON file
            fs.appendFileSync('order_report.json', JSON.stringify(reportData, null, 2) + '\n');
            console.log('Report appended to order_report.json');

            // Return the order data
            return reportData;
        } else {
            console.log('Order not found');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    } finally {
        // Close the MongoDB connection
        mongoose.disconnect();
    }
};

// Function to delete the 'order_report.json' file
module.exports.deleteOrderReportFile = function() {
    try {
        fs.unlinkSync('order_report.json');
        console.log('Order report file deleted successfully');
    } catch (error) {
        console.error('Error deleting order report file:', error);
    }
};