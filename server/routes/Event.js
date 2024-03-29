const express = require('express');
const router = express.Router();
const models = require('../database/models');
const moment = require('moment');
const {sequelize} = require('../database/database');

/* GET */
//Get all
//Returns JSON of all events
router.get("/", async (req, res) => {
    try {
        const events = await models.Event.findAll({include: [models.Instrument, models.Address, models.User]});
        res.json(events);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get single by ID
//Returns JSON of event with given event_id. Will be empty if does not exist.
router.get("/id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const event = await models.Event.findOne({where: {event_id: id}, include: [models.Instrument, models.Address, models.User]});
        res.json(event);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get most recent events (a given number)
router.get("/recent/:limit", async (req, res) => {
    try {
        const limit = req.params.limit;
        const events = await models.Event.findAll({include: [models.Instrument, models.Address, models.User], order: [['date_posted', 'DESC']], limit: sequelize.literal(limit)});
        res.json(events);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get soonest events (a given number)
router.get("/soonest/:limit", async (req, res) => {
    try {
        const limit = req.params.limit;
        const events = await models.Event.findAll({include: [models.Instrument, models.Address, models.User], order: [['start_time', 'ASC']], limit: sequelize.literal(limit)});
        res.json(events);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get Address by event_id
router.get("/address/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const address = await models.Address.findOne({where: {event_id: id}});
        res.json(address);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/* POST */
//Add new event
//Required - event_name, start_time, end_time, pay, address, user_id
//Calculated - date_posted, event_hours
//Optional - description, rehearse_hours, mileage_pay, is_listed, instruments
//Instrument can be either name or ID. Can mix and match.
router.post("/", async (req, res) => {
    try {
        //Get data
        const data = req.body;
        const addressData = data.address;
        if (!addressData) throw {message : "Event must have address."};
        else 
        {
            if (!addressData.street) throw {message : "Address must have street"};
            else if (!addressData.city) throw {message : "Address must have city"};
            else if (!addressData.zip) throw {message : "Address must have zip"};
            else if (!addressData.state) throw {message : "Address must have state"};
        }

        //Get calculated values
        let event_hours = 0;
        if (data.start_time && data.end_time)
        {
            //Convert from milliseconds to hours
            event_hours = models.getEventHours(data.start_time, data.end_time);
        }

        //Add to event & address
        const newEvent = await models.Event.create({event_name: data?.event_name, start_time: data?.start_time, end_time: data?.end_time, pay: data?.pay, address: data?.address, event_hours: event_hours, description: data?.description, rehearse_hours: data?.rehearse_hours, mileage_pay: data?.mileage_pay});
        const newAddress = await models.Address.create({event_id: newEvent.event_id, street: addressData?.street, city: addressData?.city, zip: addressData?.zip, state: addressData?.state});
        const newStatus = await models.UserStatus.create({user_id: data?.user_id, event_id: newEvent.event_id, status: "owner"});

        //Add instrument (adds relation to EventInstrument table)
        let newInstrumentArray = [];
        if (data.instruments)
        {
            for (const instrument of data.instruments) {
                //Get instrumentId
                let instrumentId = await models.getInstrumentId(instrument);
                
                //Add if found
                if (instrumentId)
                {
                    var newInstrument = await models.EventInstrument.create({instrument_id: instrumentId, event_id: newEvent.event_id});
                    newInstrumentArray.push(newInstrument);
                }
                else
                {
                    console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                }
                
            }
        }

        //Send back
        res.send({newEvent, newInstrumentArray, newAddress, newStatus});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Add users to event
router.post("/users/:event_id/:user_id", async (req, res) => {
    try {
        //Get data
        const data = req.body;
        const {event_id, user_id} = req.params;

        //Get event
        const newStatus = await models.UserStatus.findOrCreate({user_id: user_id, event_id: event_id, status: data?.status});

        res.send({newStatus});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Add instrument
//Adds instrumet(s) to event with associated event_id
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
                let instrumentId = await models.getInstrumentId(instrument); 

                //Add if found
                if (instrumentId)
                {
                    newInstrument = await models.EventInstrument.findOrCreate({where: {instrument_id: instrumentId, event_id: id}});
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
//Can update fields. Only need to send the fields you wish to update
router.put("/:id", async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const event = await models.Event.findOne({where: {event_id: id}, include: [models.Address]});
        if (event)
        {
            //Set Data
            event.set(data);

            //Recalculate Event Time (if needed)
            if (data.start_time || data.end_time)
            {
                event_hours = models.getEventHours(data.start_time ? data.start_time : event.start_time, data.end_time ? data.end_time : event.end_time);
                event.set({event_hours: event_hours});
            }

            //Set Address (if exists)
            if (data.address)
            {
                const address = await models.Address.findOne({where: {address_id: event.Address.address_id}});
                address.set(data.address);
                await address.save();
            }

            //Set Instruments (if exists)
            //Delete old entries
            await models.EventInstrument.destroy({where: {event_id: id}});

            //Add instrument (adds relation to EventInstrument table)
            newInstrumentArray = [];
            if (data.instruments)
            {
                for (const instrument of data.instruments) {
                    //Get instrumentId
                    let instrumentId = await models.getInstrumentId(instrument);
                    
                    //Add if found
                    if (instrumentId)
                    {
                        newInstrument = await models.EventInstrument.findOrCreate({where: {instrument_id: instrumentId, event_id: event.event_id}});
                        newInstrumentArray.push(newInstrument);
                    }
                    else
                    {
                        console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                    }
                }
            }

            //Save
            await event.save();
            res.send({event, newInstrumentArray});
        }
        else
        {
            res.status(404).send(`No event of event_id ${id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Update event user status
router.put("/users/:event_id/:user_id", async (req, res) => {
    try {
        const data = req.body;
        const {event_id, user_id} = req.params;
        const status = await models.UserStatus.findOne({where: {event_id: event_id, user_id: user_id}});
        if (status)
        {
            //Set Data
            status.set(data);
            await status.save();
            res.send(status);
        }
        else
        {
            res.status(404).send(`No user_id ${user_id} found in relation to event of event_id ${event_id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Update Address (by event_id)
router.put("/address/:id", async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const address = await models.Address.findOne({where: {event_id: id}});
        if (address)
        {
            //Set Data
            address.set(data);
            await address.save();
            res.send(address);
        }
        else
        {
            res.status(404).send(`No address associated with event_id ${id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Update instrument
//Updates instrumet(s) to event with associated event_id
//WILL DELETE OLD ENTIRES AND UPDATE ENTIRELY WITH NEW ONES. If you need to only add or delete one instrument, use the POST and DELETE requests instead.
router.put("/instrument/:id", async (req, res) => {
    try {
        //Get data
        const data = req.body;
        const id = req.params.id;

        //Delete old entries
        await models.EventInstrument.destroy({where: {event_id: id}});

        //Add instrument (adds relation to EventInstrument table)
        newInstrumentArray = [];
        if (data.instruments)
        {
            for (const instrument of data.instruments) {
                //Get instrumentId
                let instrumentId = await models.getInstrumentId(instrument);
                
                //Add if found
                if (instrumentId)
                {
                    newInstrument = await models.EventInstrument.findOrCreate({where: {instrument_id: instrumentId, event_id: id}});
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
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const event = await models.Event.findOne({where: {event_id: id}});
        if (event)
        {
            await event.destroy();
            res.send(event);
        }
        else
        {
            res.status(404).send(`No event of event_id ${id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Delete user
router.delete("/instrument/:event_id/:user_id", async (req, res) => {
    try {
        const {event_id, user_id} = req.params;
        const status = await models.UserStatus.findOne({where: {event_id: event_id, user_id: user_id}});

        if (status)
        {
            await status.destroy();
            res.send(status);
        }
        else
        {
            res.status(404).send(`No user_id ${user_id} associated with event of event_id ${event_id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Delete instrument
router.delete("/instrument/:user_id/:instrument_id", async (req, res) => {
    try {
        const {event_id, instrument_id} = req.params;
        const instrument = await models.EventInstrument.findOne({where: {event_id: event_id, instrument_id: instrument_id}});

        if (instrument)
        {
            await instrument.destroy();
            res.send(instrument);
        }
        else
        {
            res.status(404).send(`No instrument of event_id ${event_id} and instrument_id ${instrument_id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Export
module.exports = {router};