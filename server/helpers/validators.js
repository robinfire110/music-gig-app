const { maxFinancialNameLength } = require('../../client/src/Utils');
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
    user_id: Joi.number().required(),
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

/* Financials */
const financialSchema = Joi.object({
    fin_name: Joi.string().pattern(/^[a-zA-Z0-9\s'"]+$/).max(maxFinancialNameLength).required(),
    date: Joi.date().format("YYYY-MM-DD").required(),
    total_wage: Joi.number().min(0).max(9999.99).required(),
    hourly_wage: Joi.number().min(0).max(9999.99).required(),
    event_hours: Joi.number().min(0).max(100).required(),
    event_num: Joi.number().integer().min(0).max(99),
    rehearse_hours: Joi.number().min(0).max(999.9),
    practice_hours: Joi.number().min(0).max(999.9),
    travel_hours: Joi.number().min(0).max(999.9),
    total_mileage: Joi.number().min(0).max(9999.9),
    mileage_pay: Joi.number().min(0).max(1),
    zip: Joi.string().pattern(/^[0-9]+$/).min(5).max(5),
    gas_price: Joi.number().min(0).max(9.99),
    mpg: Joi.number().min(0).max(99),
    tax: Joi.number().min(0).max(100),
    fees: Joi.number().min(0).max(9999.99),
    event_id: Joi.number().min(0)
})

module.exports = {eventSchema, addUserToEventSchema, instrumentSchema, financialSchema}