const express = require('express')
const app = express()
const User = require("../models/Users");

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            Email: req.body.email,
            Password: req.body.password,
            CompanyName: req.body.companyName,
            ContactPerson: req.body.contactPerson,
            MobileNumber: req.body.mobileNumber,
        });
        newUser.Roal = "Customer";
        // Save the user to the database
        const savedUser = await newUser.save();

        res.redirect("./login");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/login", (req, res) => {
    res.render("login", { errorMessage: "" });
})

app.post("/login", (req, res) => {
    const { Email, Password } = req.body;

    User.findOne({ Email })
        .then((data) => {
            if (!data || data.Password !== Password) {
                return res.render("login", { errorMessage: "Invalid email or password" });
            } else {
                req.session.data = data;
                res.redirect("/Company/companyList");
            }
        })
        .catch((error) => {
            console.error("Error during login:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/logout", (req, res) => {
    req.session.data = null;
    res.redirect("/user/login")
});

module.exports = app;