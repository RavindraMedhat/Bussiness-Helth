const express = require('express');
const userRout = require('./UserRout');
const companyRout = require('./companyRout');
const indicatorRout = require('./indicatorRout');
const app = express();


const verify = (req, res, next) => {
    if (req.session.data) {
        next();
    } else {
        res.redirect("/user/login");
    }
};
const isAdmin=(req, res, next) => {
    if (req.session.data.Roal === "Admin") {
        next();
    } else {
        res.redirect("/user/login");
    }
};
app.use("/user",userRout);
app.use("/Company",verify,companyRout);
app.use("/indicator",verify,isAdmin,indicatorRout);

module.exports=app;