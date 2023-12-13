const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Email : String,
    Password : String,
    Roal : String,
    CompanyName : String,
    ContactPerson : String,
    MobileNumber : String,
},{
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;