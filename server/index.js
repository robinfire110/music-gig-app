const express = require('express'); //Creates instance of express framework, which well help route things.
const cors = require("cors"); //Creates an instance of cors, to allow cross-origin requests to be made between our front-end and the server's API endpoint
const corsOptions = {
    origin: "http://localhost:3000", //Note this localhost needs to be updated when hosting on cloud
};
const app = express(); //Create the app using express
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
const {sequelize, connectToDatabase} = require('./config/database_config'); //Get object from database function
const models = require('./models/models');
const {importInstruments, getGasPrices, createFakerData} = require("./helpers/model-helpers")
const port = 5000;

//Routes (connect the files with the various routes to other parts of the site)
const routeEvent = require('./routes/Event');
const routeFinancial = require('./routes/Financial');
const routeInstrument = require('./routes/Instrument');
const routeUser = require('./routes/User');
const routeGas = require('./routes/GasPrice');
const routeAPI = require('./routes/API');

//Determines where app is hosted
app.listen(port, async () => {
    //Connect to database
    await connectToDatabase();

    //Sync models
    await sequelize.sync({ alter: false }); //THIS IS ONLY FOR DEVELOPMENT. We should comment out for final version.
    importInstruments(); //Adds instrument list if empty
    //getGasPrices(); //Update+Get Gas Prices (since API doesn't work anymore, only need to run when first adding data.)
    //createFakerData(25, 25, 25); //CREATE FAKER DATA. COMMENT OUT TO NOT CREATE DATA

    console.log(`Server is running at http://localhost:${port}`);
});

/* Routes */
app.use("/event", routeEvent.router);
app.use("/financial", routeFinancial.router);
app.use("/instrument", routeInstrument.router);
app.use("/user", routeUser.router);
app.use("/gas", routeGas.router);
app.use("/api", routeAPI.router)