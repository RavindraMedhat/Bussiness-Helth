// Create a ratings.model.js file
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    CompanyName : String,
    Data :[{
        Area : String,
        PerformanceIndicators :[{
            Performance_Indicator : String,
            rating : Number
        }]

    }]
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
