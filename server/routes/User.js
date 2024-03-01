const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
router.get("/", (req, res) => {
    res.send("User Profile Page - Will be /user/user_id for individual user page");
});

//Export
module.exports = {router};