const express = require('express');
const router = express.Router();
const models = require('../database/models');
const moment = require('moment');

function getEventHours(start_time, end_time)
{
    return (moment(end_time) - moment(start_time))/3600000;
}

/* GET */
//Get all
//Returns JSON of all events
router.get("/", async (req, res) => {
    try {
        const events = await models.Event.findAll({});
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
        const event = await models.Event.findAll({where: {event_id: id}});

        

        res.json(event);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get single by many vars
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

/* POST */
//Add new event
//Required - event_name, start_time, end_time, pay, address
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
            event_hours = getEventHours(data.start_time, data.end_time);
        }

        //Add to event & address
        const newEvent = await models.Event.create({event_name: data?.event_name, start_time: data?.start_time, end_time: data?.end_time, pay: data?.pay, address: data?.address, event_hours: event_hours, description: data?.description, rehearse_hours: data?.rehearse_hours, mileage_pay: data?.mileage_pay});
        const newAddress = await models.Address.create({event_id: newEvent.event_id, street: addressData?.street, city: addressData?.city, zip: addressData?.zip, state: addressData?.state});

        //Add instrument (adds relation to EventInstrument table)
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
                    await models.EventInstrument.create({instrument_id: instrumentId, event_id: newEvent.event_id});
                }
                else
                {
                    console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                }
                
            }
        }

        //Send back
        res.send(newEvent);
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
        const event = await models.Event.findOne({where: {event_id: id}});
        if (event)
        {
            //Set Data
            event.set(data);

            //Recalculate Event Time (if needed)
            if (data.start_time || data.end_time)
            {
                event_hours = getEventHours(data.start_time ? data.start_time : event.start_time, data.end_time ? data.end_time : event.end_time);
                event.set({event_hours: event_hours});
            }

            await event.save();
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

//Update Address
router.put("/address/:id", async (req, res) => {
    ///This really only needs to be update to update an address.
    //There won't be a situation where you will need to delete an address where you wouldn't delete the original.
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

//Export
module.exports = {router};