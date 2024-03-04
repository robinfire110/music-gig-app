const express = require('express');
const router = express.Router();
const models = require('../database/models');

//Get all
//Returns JSON of all users
router.get("/", async (req, res) => {
    try {
        const users = await models.User.findAll({});
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
        const user = await models.User.findAll({where: {user_id: id}});
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
        const user = await models.User.findAll({where: {email: email}});
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//POST
//Required - email, password, f_name, l_name, zip
//Optional - Bio, is_admin (default: false), instrument(s)
//Instrument can be either name or ID. Can mix and match.
router.post("/", async (req, res) => {
    try {
        //Get data
        const data = req.body;

        //Add to User
        const newUser = await models.User.create({email: data?.email, password: data?.password, f_name: data?.f_name, l_name: data?.l_name, zip: data?.zip, bio: data?.bio, is_admin: data?.is_admin});

        //Add instrument (adds relation to UserInstrument table)
        if (data.instruments)
        {
            for (const instrument of data.instruments) {
                let instrumentId = instrument; 

                //Get Instrument by name
                if (typeof instrument == "string")
                {
                    instrumentId = (await models.Instrument.findOne({where: {name: instrument}}))?.instrument_id;
                }
                else
                {
                    instrumentId = (await models.Instrument.findOne({where: {instrument_id: instrument}}))?.instrument_id;
                }
                
                //Add if found
                if (instrumentId)
                {
                    await models.UserInstrument.create({instrument_id: instrumentId, user_id: newUser.user_id});
                }
                else
                {
                    console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                }
                
            }
        }
        res.send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
});

//UPDATE
//Can update fields. Only need to send the fields you wish to update
router.put("/:id", async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const user = await models.User.findOne({where: {user_id: id}});
        if (user)
        {
            user.set(data);
            await user.save();
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

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await models.User.findOne({where: {user_id: id}});
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

//Export
module.exports = {router};