const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
router.get("/", (req, res) => {
    res.send("Landing Page");
});

//POST
router.post("/", async (req, res) => {
    const data = req.body;
    //Do something in the database (i.e)
    await models.User.create({email: data?.email, password: data?.password, f_name: data?.f_name, l_name: data?.l_name, zip: data?.zip});
    res.send(data);
});

//Export
module.exports = {router};