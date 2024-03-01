const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
router.get("/", (req, res) => {
    res.send("Event Page - Just /event will be all event pages, /event/event_id will be individual");
});

//Export
module.exports = {router};