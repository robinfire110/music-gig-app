const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
router.get("/", (req, res) => {
    res.send("Instrument Database");
});

//Export
module.exports = {router};