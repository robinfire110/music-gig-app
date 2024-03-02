const express = require('express');
const router = express.Router();
const models = require('../database/models');

//Get
router.get("/", async (req, res) => {

    res.send("Get User - To be implemented. Ideally, you use /user to get all users and /user/user_id to get a specific user")
});

//POST
router.post("/", async (req, res) => {
    const data = req.body;

    //Post data
    //Required - email, password, f_name, l_name, zip
    //Optional - Bio, is_admin (defaults false), instrument(s)
    await models.User.create({email: data?.email, password: data?.password, f_name: data?.f_name, l_name: data?.l_name, zip: data?.zip, bio: data?.bio, is_admin: data?.is_admin});
    res.send(data);
});

//PUT
router.get("/", async (req, res) => {
    res.send("Update User - Ideally would be /user/user_id with data to change specific user")
});

//DELETE
router.get("/", async (req, res) => {
    res.send("Delete User - To be implemented. It would be /user/user_id to delete")
});

//Export
module.exports = {router};