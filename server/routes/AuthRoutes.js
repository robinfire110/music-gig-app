const express = require('express');
const router = express.Router();
const { auth } = require('express-openid-connect');
const authConfig = require('../config/Auth');

//start itup
router.use(auth(authConfig));

//define authenticated routes
router.use('/profile', auth(authConfig));
router.use('/admin', auth(authConfig));

// Protected routes
router.get('/profile', (req, res) => {
    res.send('User profile page');
});

router.get('/admin', (req, res) => {
    res.send('Admin page');
});

module.exports = {router};