const express = require('express');
const app = express();
const es = require("express-session");

const User = require('./models/Users'); // Adjust the path based on your project structure

const allRout = require("./Routers/allRout");
const port = process.env.PORT || 7485;


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

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(
    es({
            secret:"RV",
            resave:false,
            saveUninitialized:true
        })
    );



app.use(allRout);



app.listen(port, () => {
    console.log(`Server is running on https://business-health.cyclic.app/`);
    console.log(`Server is running on http://localhost:7485`);
});
