const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
router.get("/", (req, res) => {
    res.send("Login Page - /login will be login and if needed, /login/register can be register");
});

//Export
module.exports = {router};