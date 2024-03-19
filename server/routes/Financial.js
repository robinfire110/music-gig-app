const express = require('express');
const router = express.Router();
const models = require('../database/models');

/* GET */
//Get User Financial
router.get("/user_id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const financials = await models.Financial.findAll({include: {model: models.User, where: {user_id: id}, attributes: []}});
        res.json(financials);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get Financial by fin id
router.get("/fin_id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const financial = await models.Financial.findOne({where: {fin_id: id}, include: {model: models.User}});
        res.json(financial);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get Financial by user and fin id
router.get("/user_id/fin_id/:user_id/:fin_id", async (req, res) => {
    try {
        const {user_id, fin_id} = req.params;
        const financials = await models.Financial.findAll({where: {fin_id: fin_id}, include: {model: models.User, where: {user_id: user_id}, attributes: []}});
        res.json(financials);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get Financial by user and fin id
router.get("/user_id/event_id/:user_id/:event_id", async (req, res) => {
    try {
        const {user_id, event_id} = req.params;
        const financials = await models.Financial.findAll({where: {event_id: event_id}, include: {model: models.User, where: {user_id: user_id}, attributes: []}});
        res.json(financials);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/* POST */
//Add new financial
//Required - fin_name, total_wage, event_hours, date
//Optional - hourly_wage, rehearse_hours, practice_hours, travel_hours, total_mileage, mileage_pay, zip, gas_price, mpg, tax, fees, event_id
router.post("/:id", async (req, res) => {
    try {
        //Get data
        const id = req.params.id;
        const data = req.body;

        //Add to User
        const newFinancial = await models.Financial.create({fin_name: data?.fin_name, date: data?.date, total_wage: data?.total_wage, hourly_wage: data?.hourly_wage, event_hours: data?.event_hours, rehearse_hours: data?.rehearse_hours, practice_hours: data?.practice_hours, travel_hours: data?.travel_hours, total_mileage: data?.total_mileage, mileage_pay: data?.mileage_pay, zip: data?.zip, gas_price: data?.gas_price, mpg: data?.mpg, tax: data?.tax, fees: data?.fees, event_id: data?.event_id});
        const newFinStatus = await models.FinStatus.create({user_id: id, fin_id: newFinancial.fin_id});
        res.send(newFinancial);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
    try {
        //Get data
        const id = req.params.id;
        const data = req.body;
        const financial = await models.Financial.findOne({where: {fin_id: id}});
        if (financial)
        {
            financial.set(data);
            await financial.save();
            res.send(financial);
        }
        else
        {
            res.status(404).send(`No financial of fin_id ${id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const financial = await models.Financial.findOne({where: {fin_id: id}});
        if (financial)
        {
            await financial.destroy();
            res.send(financial);
        }
        else
        {
            res.status(404).send(`No financial of fin_id ${id} found.`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Export
module.exports = {router};