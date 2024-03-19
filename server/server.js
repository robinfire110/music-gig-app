//We configure COrs, initialize & run EXpress REST APIS.
const express = require("express"); //Creates instance of express framework, which well help route things.
const bodyParser = require("body-parser"); // parses data and makes it available in the req.body
const cors = require("cors"); //Creates an instance of cors, to allow cross-origin requests to be made between our front-end and the server's API endpoint
const dotenv = require("dotenv"); //Allows us to use environment variables
const db = require("./models");

const app = express(); //Create the app using express

const corsOptions = {
  origin: "http://localhost:3000", //Note this localhost needs to be updated when hosting on cloud
};
app.use(cors(corsOptions));

app.use(bodyParser.json()); //parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); //parse requests of content-type - application/x-www-form-urlencoded

//test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  try {
    await db.sequelize.sync({ alter: false });
    console.log("Database connected");
    // await models.importInstruments();
  } catch (error) {
    console.log(error);
  }
});

// const { sequelize, connectToDatabase } = require("./config/database"); //Get object from database function
// const instrumentList = require("./database/instrumentList");
// const models = require("./database/models");
// const port = 5000;
//
// //Routes (connect the files with the various routes to other parts of the site)
// const routeEvent = require("./routes/Event");
// const routeFinancial = require("./routes/Financial");
// const routeInstrument = require("./routes/Instrument");
// const routeUser = require("./routes/User");
//
// //Determines where app is hosted
// app.listen(port, async () => {
//   //Connect to database
//   await connectToDatabase();
//
//   //Sync models
//   await sequelize.sync({ alter: false }); //THIS IS ONLY FOR DEVELOPMENT. We should comment out for final version.
//   models.importInstruments(); //Adds instrument list if empty
//   //models.createFakerData(25, 25, 25); //CREATE FAKER DATA. COMMENT OUT TO NOT CREATE DATA
//
//   console.log(`Server is running at http://localhost:${port}`);
// });
//
// /* Routes */
// app.use("/event", routeEvent.router);
// app.use("/financial", routeFinancial.router);
// app.use("/instrument", routeInstrument.router);
// app.use("/user", routeUser.router);
