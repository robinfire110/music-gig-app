const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
router.get("/", (req, res) => {
    res.send("Financial database");
});

//Export
module.exports = {router};