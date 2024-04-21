// getCartDate.spec.js

// Import necessary modules
const { _electron: electron } = require('@playwright/test');
const { test, expect, request } = require('@playwright/test');
const mongoose = require('mongoose');
const fs = require('fs');

// Define the MongoDB connection URI
const mongoURI = 'mongodb+srv://Itzik:Itzik12345!@test-stg.w3ecl.mongodb.net/data-center-client-stg';

// Export the function for use in other files
module.exports = async function getCartDate(cartNumber) {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Define the schema
        const cartSchema = new mongoose.Schema({
            active: Boolean,
            type: String,
            loginToken: String,
            dimension: String,
            cartNumber: Number,
            name: String,
            branch: mongoose.Schema.Types.ObjectId,
            component: [{
                type: String,
                name: String,
                port: Number
            }],
            createdAt: Date,
            updatedAt: Date,
            __v: Number,
            loginToken2: String
        });

        // Create the model
        const Cart = mongoose.model('Cart', cartSchema);

        // Find the document with the provided cartNumber
        const cart = await Cart.findOne({ cartNumber });

        if (cart) {
            console.log('Cart Number:', cart.cartNumber);
            console.log('Created At:', cart.createdAt);

            // Generate report in JSON format
            const reportData = {
                cartNumber: cart.cartNumber,
                createdAt: cart.createdAt,
                active: cart.active,
                type: cart.type,
                // Add other fields as needed
            };

            // Write report data to JSON file
            fs.writeFileSync('cart_report.json', JSON.stringify(reportData, null, 2));
            console.log('Report generated: cart_report.json');
            // Return the cart data
            return reportData;
        } else {
            console.log('Cart not found');
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
