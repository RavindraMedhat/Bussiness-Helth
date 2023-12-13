const express = require('express')
const app = express();
const moment = require('moment');
const nodemailer = require('nodemailer');
const ejs=require("ejs");

const Indicator = require('../models/indicators');  
const Rating = require('../models/ratings');

app.get("/companyList", async (req, res) => {

    function calculateOverallScore(data) {
        let totalScore = 0;
        let totalIndicators = 0;

        // Loop through each area
        data.forEach(area => {
            // Loop through each performance indicator
            area.PerformanceIndicators.forEach(indicator => {
                totalScore += indicator.rating;
                totalIndicators += 1;
            });
        });

        // Calculate overall score (average rating)
        const overallScore = totalIndicators > 0 ? (totalScore / totalIndicators).toFixed(2) : 0;
        return overallScore;
    }

    try {
        console.log(req.session.data.Roal);
        if (req.session.data.Roal === "Admin" || req.session.data.Roal === "Team member") {
            if (req.query.str != null) {
                var cn = req.query.str;

                cn = cn.replace(/^\s+|\s+$/g, "");


                const companies = await Rating.find({ CompanyName: { $regex: cn, $options: 'i' } }).sort({ timestamps: 1 }).sort({companyName:1});
                var overallScore = 0;
                var i = 0;
                
                const formattedRatings = companies.map(rating => ({
                    id: rating._id,
                    CompanyName: rating.CompanyName,
                    formattedTimestamp: moment(rating.timestamps).format('YYYY-MM-DD HH:mm:ss'),
                    overallScore: calculateOverallScore(rating.Data),
                }));
                res.render('companyList', { companies: formattedRatings, isAdmin: true });

            } else {

                const ratings = await Rating.find().sort({ timestamps: -1 });
                const last10Ratings = ratings.slice(0, 10);

                const formattedRatings = last10Ratings.map(rating => ({
                    id: rating._id,
                    CompanyName: rating.CompanyName,
                    formattedTimestamp: moment(rating.timestamps).format('YYYY-MM-DD HH:mm:ss'),
                    overallScore: calculateOverallScore(rating.Data),
                }));

                res.render('companyList', { companies: formattedRatings, isAdmin: true });
            }

        } else if (req.session.data.Roal === "Customer") {

            const companyName = req.session.data.CompanyName;
            const ratings = await Rating.find({ CompanyName: companyName }).sort({ timestamps: 1 });

            const formattedRatings = ratings.map(rating => ({
                id: rating._id,
                CompanyName: rating.CompanyName,
                formattedTimestamp: moment(rating.timestamps).format('DD-MM-YYYY'),
                overallScore: calculateOverallScore(rating.Data),
            }));

            res.render('companyList', { companies: formattedRatings, isAdmin: false, CompanyName: companyName });

        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/detailPage/:id', (req, res) => {
    Rating.findById(req.params.id).then((data) => {

        res.render('details', { id : req.params.id ,Company : data.CompanyName });
    }).catch((error) => {
        console.log(error);
        res.send(data_for_graph);
    });
        
});

app.get('/data/:id', (req, res) => {
    console.log("data");
    var id = req.params.id;

    Rating.findById(id).then((data) => {

        console.log(data.Data);

        // Initialize an empty object to store the total rating and count for each area
        const areaStats = {};

        // Loop through the data to calculate the total rating and count for each area
        data.Data.forEach((area) => {
            const areaName = area.Area;
            const performanceIndicators = area.PerformanceIndicators;

            // Calculate the total rating for the area
            const totalRating = performanceIndicators.reduce((sum, indicator) => {
                return sum + indicator.rating;
            }, 0);

            // Calculate the count of performance indicators in the area
            const indicatorCount = performanceIndicators.length;

            // Calculate the average rating for the area
            const averageRating = indicatorCount > 0 ? totalRating / indicatorCount : 0;

            // Store the result in the areaStats object
            areaStats[areaName] = averageRating;
        });

        // Initialize an array to store the final result in the desired format
        const result = Object.keys(areaStats).map((areaName) => {
            return { department: areaName, count: areaStats[areaName].toFixed(2) };
        });

        console.log(result);

        // console.log(departmentCounts);

        res.send(result);

    }).catch((error) => {
        console.log(error);
        res.send(data_for_graph);
    });
});

app.get("/addRating",async (req,res)=>{
    const indicators = await Indicator.find().sort({area : 1});
    res.render('AddRating', { indicators: indicators });
});

app.post('/submit-ratings', async (req, res) => {
    // console.log(req.body);

    const transformedData = [];

    // Extract the company name
    const companyName = req.session.data.CompanyName;
    const indicators = await Indicator.find().sort({area : 1});
    // Loop through the indicatorsData array and create the desired structure
    indicators.forEach((item, index) => {
        const area = item.area;
        const performanceIndicator = item['performanceIndicator'];
        const rating = parseInt(req.body[`rating-${index}`]);

        // Find or create the data object for the current area
        let areaData = transformedData.find((data) => data.Area === area);
        if (!areaData) {
            areaData = { Area: area, PerformanceIndicators: [] };
            transformedData.push(areaData);
        }
        // Add the performance indicator and rating to the area data
        areaData.PerformanceIndicators.push({
            Performance_Indicator: performanceIndicator,
            rating: rating,
        });
    });

    // Create the final data object
    const finalData = {
        CompanyName: companyName,
        Data: transformedData,
    };
    console.log(finalData);

    try {
        const data = new Rating(finalData);
        data.save().then((savedata)=>{
            res.redirect('/Company/companyList');
            sendEmail(req.session.data.Email,req.session.data.CompanyName,savedata._id);
        });
    } catch (err) {
        console.log(err);
        res.redirect('/NotAdded');

    }

});

async function sendEmail(email,companyName,id) {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mazzking666@gmail.com',  // replace with your Gmail email address
                pass: 'xctj naln sjnj gjsv',  // replace with your Gmail password
            },
        });
        
        // Email content
        const mailOptions = {
            from: 'mazzking666@gmail.com',  // replace with your Gmail email address
            to: email,  // replace with the recipient's email address
            subject: 'New Ratings Submitted',
            text: `New ratings have been submitted for ${companyName}.`,
            html: htmlContent,
        };

        // Send email
        await transporter.sendMail(mailOptions); 
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = app;