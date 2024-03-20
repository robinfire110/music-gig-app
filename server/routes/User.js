const express = require('express');
const router = express.Router();
const {getInstrumentId} = require("../helpers/model-helpers");
const db = require('../models/models');

/* GET */
//Get all
//Returns JSON of all users
router.get("/", async (req, res) => {
    try {
        const users = await db.User.findAll({include: [db.Instrument, db.Event]});
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get single by ID
//Returns JSON of user with given user_id. Will be empty if does not exist.
router.get("/id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await db.User.findOne({where: {user_id: id}, include: [db.Instrument, db.Event]});
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



//Get single by email
//Returns JSON of user with given email. Will be empty if does not exist.
router.get("/email/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const user = await db.User.findOne({where: {email: email}, include: [db.Instrument, db.Event]});
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/* POST */
//Add new user
//Required - email, password, f_name, l_name, zip
//Optional - Bio, is_admin (default: false), instrument(s)
//Instrument can be either name or ID. Can mix and match.
router.post("/", async (req, res) => {
    try {
        //Get data
        const data = req.body;

        //Add to User
        const newUser = await db.User.create({email: data?.email, password: data?.password, f_name: data?.f_name, l_name: data?.l_name, zip: data?.zip, bio: data?.bio, is_admin: data?.is_admin});

        //Add instrument (adds relation to UserInstrument table)
        newInstrumentArray = [];
        if (data.instruments)
        {
            for (const instrument of data.instruments) {
                //Get instrumentId
                let instrumentId = await getInstrumentId(instrument);
                
                //Add if found
                if (instrumentId)
                {
                    newInstrument = await db.UserInstrument.create({instrument_id: instrumentId, user_id: newUser.user_id});
                    newInstrumentArray.push(newInstrument);
                }
                else
                {
                    console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                }
                
            }
        }
        res.send({newUser, newInstrumentArray});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Add instrument
//Adds instrumet(s) to user with associated user_id
router.post("/instrument/:id", async (req, res) => {
    try {
        //Get data
        const data = req.body;
        const id = req.params.id;

        //Add instrument (adds relation to UserInstrument table)
        newInstrumentArray = [];
        if (data.instruments)
        {
            for (const instrument of data.instruments) {
                //Get instrumentId
                let instrumentId = await getInstrumentId(instrument);
                
                //Add if found
                if (instrumentId)
                {
                    newInstrument = await db.UserInstrument.findOrCreate({where: {instrument_id: instrumentId, user_id: id}});
                    newInstrumentArray.push(newInstrument);
                }
                else
                {
                    console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                }
                
            }
        }
        res.send({newInstrumentArray});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/* UPDATE */
//Update user
//Can update fields. Only need to send the fields you wish to update
router.put("/:id", async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const user = await db.User.findOne({where: {user_id: id}});
        if (user)
        {
            //Update user
            user.set(data);
            await user.save();

            //Update instrument (if exists)
            newInstrumentArray = [];
            if (data.instruments)
            {
                await db.UserInstrument.destroy({where: {user_id: id}});
                for (const instrument of data.instruments) {
                    //Get instrumentId
                    let instrumentId = await getInstrumentId(instrument);
                    
                    //Add if found
                    if (instrumentId)
                    {
                        newInstrument = await db.UserInstrument.findOrCreate({where: {instrument_id: instrumentId, user_id: id}});
                        newInstrumentArray.push(newInstrument);
                    }
                    else
                    {
                        console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                    }
                }
            }

            res.send({user, newInstrumentArray});
        }
        else
        {
            res.status(404).send(`No user of user_id ${id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Update instrument
//Updates instrumet(s) to user with associated user_id
//WILL DELETE OLD ENTIRES AND UPDATE ENTIRELY WITH NEW ONES. If you need to only add or delete one instrument, use the POST and DELETE requests instead.
router.put("/instrument/:id", async (req, res) => {
    try {
        //Get data
        const data = req.body;
        const id = req.params.id;

        //Add instrument (adds relation to UserInstrument table)
        newInstrumentArray = [];
        if (data.instruments)
        {
             //Delete old entries
            await db.UserInstrument.destroy({where: {user_id: id}});
            
            for (const instrument of data.instruments) {
                //Get instrumentId
                let instrumentId = await getInstrumentId(instrument);
                
                //Add if found
                if (instrumentId)
                {
                    newInstrument = await db.UserInstrument.findOrCreate({where: {instrument_id: instrumentId, user_id: id}});
                    newInstrumentArray.push(newInstrument);
                }
                else
                {
                    console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                }
            }
        }
        else
        {
            throw {message: "No instrument object given."};
        }
        res.send({newInstrumentArray});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/* DELETE */
//Delete user
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await db.User.findOne({where: {user_id: id}});
        if (user)
        {
            await user.destroy();
            res.send(user);
        }
        else
        {
            res.status(404).send(`No user of user_id ${id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Delete instrument
router.delete("/instrument/:user_id/:instrument_id?", async (req, res) => {
    try {
        const {user_id, instrument_id} = req.params;
        const instrument = await db.UserInstrument.findOne({where: {user_id: user_id, instrument_id: instrument_id}});

        if (instrument)
        {
            await instrument.destroy();
            res.send(instrument);
        }
        else
        {
            res.status(404).send(`No instrument of user_id ${user_id} and instrument_id ${instrument_id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Export
module.exports = {router};