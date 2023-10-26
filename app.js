const express = require('express');
const app = express();
const port = process.env.PORT || 7485;

const Rating = require('./Models/ratings');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://test:74857485@cluster0.3snq0fm.mongodb.net/BussinessHelthDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});

const indicatorsData = [
    {
        "Area": "PERSONAL",
        "Performance Indicator": "Timings"
    },
    {
        "Area": "PERSONAL",
        "Performance Indicator": "Effectiveness"
    },
    {
        "Area": "PERSONAL",
        "Performance Indicator": "Corporate communication"
    },
    {
        "Area": "PERSONAL",
        "Performance Indicator": "CEO's Scope"
    },
    {
        "Area": "PERSONAL",
        "Performance Indicator": "Fear"
    },
    {
        "Area": "PERSONAL",
        "Performance Indicator": "Blind spots"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Timings"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Management effectiveness"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Parternership"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Scope of work"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Locations barriers"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "People Skill"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Present Organisation Structure"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Risks of outsourcing"
    },
    {
        "Area": "MANAGEMENT",
        "Performance Indicator": "Compeitior analysis"
    },
    {
        "Area": "FINANCE",
        "Performance Indicator": "Profit & loss account"
    },
    {
        "Area": "FINANCE",
        "Performance Indicator": "Monthly accountings"
    },
    {
        "Area": "FINANCE",
        "Performance Indicator": "Yearly Budget planning "
    },
    {
        "Area": "FINANCE",
        "Performance Indicator": "Taxation"
    },
    {
        "Area": "FINANCE",
        "Performance Indicator": "Wealth creation"
    },
    {
        "Area": "HR",
        "Performance Indicator": "HR"
    },
    {
        "Area": "HR",
        "Performance Indicator": "Talent Shortage"
    },
    {
        "Area": "HR",
        "Performance Indicator": "Recruitment & Selection"
    },
    {
        "Area": "HR",
        "Performance Indicator": "Training & Develeopment"
    },
    {
        "Area": "HR",
        "Performance Indicator": "Performanace Measurement"
    },
    {
        "Area": "HR",
        "Performance Indicator": "Social media awareness"
    },
    {
        "Area": "HR",
        "Performance Indicator": "Infrastucture issues"
    },
    {
        "Area": "HR",
        "Performance Indicator": "Happiness Culture"
    },
    {
        "Area": "Complience ",
        "Performance Indicator": "Government rules of different countries."
    },
    {
        "Area": "Complience ",
        "Performance Indicator": "Employee welfare"
    },
    {
        "Area": "Complience ",
        "Performance Indicator": "EPF, Gratuity fund"
    },
    {
        "Area": "Administration",
        "Performance Indicator": "Office cleanliness"
    },
    {
        "Area": "Administration",
        "Performance Indicator": "Daily petti cash"
    },
    {
        "Area": "Administration",
        "Performance Indicator": "Bank & other works"
    },
    {
        "Area": "Administration",
        "Performance Indicator": "Other inside/out side office works"
    },
    {
        "Area": "SALES",
        "Performance Indicator": "Sales Revenue"
    },
    {
        "Area": "SALES",
        "Performance Indicator": "Understand the business model"
    },
    {
        "Area": "SALES",
        "Performance Indicator": "Java script, angular, nodjs"
    },
    {
        "Area": "SALES",
        "Performance Indicator": "Sales Targets"
    },
    {
        "Area": "SALES",
        "Performance Indicator": "Sales Team building "
    },
    {
        "Area": "Marketing ",
        "Performance Indicator": "Digital Marketing on social media "
    },
    {
        "Area": "Marketing ",
        "Performance Indicator": "Direct client management"
    },
    {
        "Area": "Marketing ",
        "Performance Indicator": "Customer Relationship management"
    },
    {
        "Area": "TECHNICAL",
        "Performance Indicator": "Project management"
    },
    {
        "Area": "TECHNICAL",
        "Performance Indicator": "Team leaders "
    },
    {
        "Area": "TECHNICAL",
        "Performance Indicator": "Team Building "
    },
    {
        "Area": "TECHNICAL",
        "Performance Indicator": " RnD"
    },
    {
        "Area": "TECHNICAL",
        "Performance Indicator": " Productivity"
    },
    {
        "Area": "TECHNICAL",
        "Performance Indicator": " Quality"
    },
    {
        "Area": "TECHNICAL",
        "Performance Indicator": "Which technology you are working on"
    },
    {
        "Area": "SUPPORT",
        "Performance Indicator": "Network"
    },
    {
        "Area": "SUPPORT",
        "Performance Indicator": "Security "
    },
    {
        "Area": "SECURITY",
        "Performance Indicator": "Cyber Security Threats"
    },
    {
        "Area": "SECURITY",
        "Performance Indicator": "Cloud Computing"
    },
    {
        "Area": "SECURITY",
        "Performance Indicator": "Remote Workplace"
    }
];

var data_for_graph = [
    { department: 'MANAGEMENT', count: 0 },
    { department: 'FINANCE', count: 0 },
    { department: 'HR', count: 0 },
    { department: 'Administration', count: 0 },
    { department: 'SALES', count: 0 },
    { department: 'Marketing', count: 0 },
    { department: 'TECHNICAL', count: 0 },
    { department: 'SUPPORT', count: 0 }
];

app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/last-10-companies', async (req, res) => {
    try {
        // Assuming you have a model for your companies, replace 'Company' with your actual model name
        const companies = await Rating.find() // Assuming your company model has a 'name' field
            .limit(10) // Limit the results to 10
            .sort({ _id: -1 }); // Sort by _id in descending order (assuming it represents the creation date)

        const companyNames = companies.map(company => company.CompanyName);
        res.json(companyNames);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching companies');
    }
});

app.get('/search/:str', async (req, res) => {
    try {
        var cn = req.params.str;

        cn = cn.replace(/^\s+|\s+$/g, "");

        // Assuming you have a model for your companies, replace 'Company' with your actual model name
        const companies = await Rating.find({ CompanyName: { $regex: cn, $options: 'i' } }) // Assuming your company model has a 'name' field
            .limit(10) // Limit the results to 10
            .sort({ _id: -1 }); // Sort by _id in descending order (assuming it represents the creation date)

        const companyNames = companies.map(company => company.CompanyName);
        res.json(companyNames);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching companies');
    }
});

app.get('/BussinessHelth/:Company', (req, res) => {
    var Company = req.params.Company;
    res.render('Details', { Company });
});

app.get('/ratings', (req, res) => {
    res.render('Form', { indicators: indicatorsData });
});

app.get('/data/:Company', (req, res) => {
    var cn = req.params.Company;

    cn = cn.replace(/^\s+|\s+$/g, "");

    console.log({ CompanyName: cn });
    Rating.findOne({ CompanyName: cn }).then((data) => {

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

app.post('/submit-ratings', async (req, res) => {
    // console.log(req.body);

    const transformedData = [];

    // Extract the company name
    const companyName = req.body.companyName;

    // Loop through the indicatorsData array and create the desired structure
    indicatorsData.forEach((item, index) => {
        const area = item.Area;
        const performanceIndicator = item['Performance Indicator'];
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
        data.save();
        res.redirect('/BussinessHelth/'+finalData.CompanyName);

    } catch (err) {
        console.log(err);
        res.redirect('/NotAdded');

    }

});

app.listen(port, () => {
    console.log(`Server is running on http://103.217.85.148:8080/}`);
});
