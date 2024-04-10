const { instrumentListLength, instrumentList } = require('./instrumentList');

const Joi = require('joi').extend(require('@joi/date'));

//Values (make sure they are also in Utils.js in client side)
const maxDescriptionLength = 750; //Max length for event descriptions
const maxBioLength = 500; //Max length for user bios
const maxEventNameLength = 50;

/* Instruments */
const instrumentSchema = Joi.array().sparse().items(Joi.number().integer().min(0).max(instrumentListLength));

/* Event */
//Event Data
const eventSchema = Joi.object({
    user_id: Joi.number(),
    event_name: Joi.string().pattern(/^[a-zA-Z0-9\s'"]+$/).max(maxEventNameLength).required(),
    start_time: Joi.date().format('YYYY-MM-DD HH:mm:ss').required(),
    end_time: Joi.date().format('YYYY-MM-DD HH:mm:ss').required(),
    pay: Joi.number().min(0).max(9999.99).required(),
    event_hours: Joi.number().min(0).max(1000).required(),
    rehearse_hours: Joi.number().min(0).max(100),
    description: Joi.string().max(maxDescriptionLength).allow(null, ''),
    mileage_pay: Joi.number().max(1),
    instruments: instrumentSchema,
    is_listed: Joi.boolean().truthy(1).falsy(0),
    address: {
        street: Joi.string().pattern(/^[a-zA-Z0-9\s']+$/).max(100).required(),
        city: Joi.string().pattern(/^[a-zA-Z\s.,']+$/).max(100).required(),
        zip: Joi.string().pattern(/^[0-9]+$/).min(5).max(5).required(),
        state: Joi.string().pattern(/^[A-Z]+$/).min(2).max(2).required()
    }
});

const addUserToEventSchema = Joi.object({
    status: Joi.string().valid("owner", "applied", "accept", "reject", "withdraw").required()
});


module.exports = {eventSchema, addUserToEventSchema, instrumentSchema}