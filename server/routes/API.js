const express = require('express');
const router = express.Router();
const models = require('../database/models');

//GET
router.get("/", (req, res) => {
    res.send("API - This is only for use for getting data from the back-end to the front-end and vice versa.");
});

/* User */
//Get
router.get("/user", async (req, res) => {
    res.send("Get User - To be implemented. Ideally, you use /api/user to get all users and /api/user/user_id to get a specific user")
});

//POST
router.post("/user", async (req, res) => {
    const data = req.body;
    //Do something in the database (i.e)
    await models.User.create({email: data?.email, password: data?.password, f_name: data?.f_name, l_name: data?.l_name, zip: data?.zip});
    res.send(data);
});

//PUT
router.get("/user", async (req, res) => {
    res.send("Update User - Ideally would be /api/user/user_id with data to change specific user")
});

//DELETE
router.get("/user", async (req, res) => {
    res.send("Delete User - To be implemented. It would be /api/user/user_id to delete")
});

//Export
module.exports = {router};