const express = require('express'); //Creates instance of express framework, which well help route things.
const app = express(); //Create the app using express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const {sequelize, connectToDatabase} = require('./database/database'); //Get object from database function
const models = require('./database/models');
const instrumentList = require('./database/instrumentList');

//Routes (connect the files with the various routes to other parts of the site)
const routeAPI = require('./routes/API'); //Backend API
const routeAccount = require('./routes/Account');
const routeCalcualtor = require('./routes/Calculator');
const routeEvent = require('./routes/Event');
const routeLanding = require('./routes/Landing');
const routeLogin = require('./routes/Login');
const routeUser = require('./routes/User');

//Determines where app is hosted
app.listen(5000, async () => {
    //Connect to database
    await connectToDatabase();

    //Sync models
    await sequelize.sync({ alter: false }); //THIS IS ONLY FOR DEVELOPMENT. We should comment out for final version.
    instrumentList.importInstruments();

    console.log('Server is running at http://localhost:5000');
});

/* Routes */
app.use("/api", routeAPI.router);
app.use("/account", routeAccount.router);
app.use("/calculator", routeCalcualtor.router);
app.use("/event", routeEvent.router);
app.use("/", routeLanding.router);
app.use("/login", routeLogin.router);
app.use("/user", routeUser.router);

/* TESTING ROUTES */
//Testing adding user to database
app.get('/add', async (req, res) => {
    //await models.User.create({email: "test@email.com", password: "123", f_name: "John", l_name: "Smith", zip: "12345"}); //Test insert statement using Sequelize (much easier than SQL statement!)
    //await models.Event.create({event_name: "Test Event", date: "2023-02-02", time: "01:01:01", pay: 300.00});
    await models.UserStatus.create({UserUserId: 1, EventEventId: 1});
    res.json("Added");
});