const { isnotlogedin } = require('../lib/out');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/configuracion');

router.get('/configuracion', isnotlogedin, controller.get_configuracion);

router.post('/configuracion', isnotlogedin, controller.post_configuracion);
module.exports = router;