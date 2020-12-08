const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
const controller = require('../controllers/auth');

router.get('/signin',islogedin, controller.get_auth);
router.post('/signin',controller.post_auth);
router.get('/logout',controller.get_logout);

module.exports = router;