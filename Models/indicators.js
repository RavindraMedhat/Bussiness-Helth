const mongoose = require('mongoose');

const indicatorSchema = new mongoose.Schema({
    area: String,
    performanceIndicator: String,
});

const IndicatorModel = mongoose.model('Indicator', indicatorSchema);

module.exports = IndicatorModel;
