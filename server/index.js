const express = require('express'); //Creates instance of express framework, which well help route things.
const app = express(); //Create the app using express
const {sequelize, connectToDatabase} = require('./database/database'); //Get object from database function
const models = require('./database/models')

//Determines where app is hosted
app.listen(5000, async () => {
    //Connect to database
    await connectToDatabase();

    //Sync models
    //await sequelize.sync({ alter: true }); //This should work, but doesn't. So I'll sync individually for now.
    await models.User.sync({ alter: true });
    await models.Instrument.sync({ alter: true });
    await models.Event.sync({ alter: true });
    console.log('Server is running at http://localhost:5000');
});

//Testing route for '/' path.
app.get('/', (req, res) => {
    res.status(200).json({message: "Hello World"});
});

//Testing adding user to database
app.get('/add', async (req, res) => {
    await models.User.create({email: "test@email.com", password: "123", f_name: "John", l_name: "Smith", zip: "12345"}); //Test insert statement using Sequelize (much easier than SQL statement!)
    res.json("Added");
});