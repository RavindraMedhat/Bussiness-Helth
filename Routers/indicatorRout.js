const express = require('express')
const app = express();

const Indicator = require('../models/indicators');

app.get('/indicators', async (req, res) => {
    try {
        // Fetch all indicators from the database
        const indicators = await Indicator.find().sort({area : 1});

        // Render the Indicators page with the retrieved data
        res.render('Indicators', { indicators });
    } catch (error) {
        console.error('Error fetching indicators:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission for adding a new indicator
app.post('/addIndicator', async (req, res) => {
    try {
        // Extract data from the form
        const { area, performanceIndicator } = req.body;

        // Create a new indicator instance
        const newIndicator = new Indicator({
            area,
            performanceIndicator,
            // ... add other fields here
        });

        // Save the new indicator to the database
        await newIndicator.save();

        // Redirect back to the Indicators page after adding
        res.redirect('/indicator/indicators');
    } catch (error) {
        console.error('Error adding indicator:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;