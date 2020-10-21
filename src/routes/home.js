const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
const controller = require('../controllers/home');

router.get('/home',isnotlogedin, controller.home);

module.exports = router;