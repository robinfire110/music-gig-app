const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
//Get all instruments
router.get("/", async (req, res) => {
    try {
        const instruments = await models.Instrument.findAll();
        res.json(instruments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get single instrument by id
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const instruments = await models.Instrument.findOne({where: {instrument_id: id}});
        res.json(instruments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Export
module.exports = {router};