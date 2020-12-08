const express = require('express');
const router = express.Router();
const controller = require('../controllers/servicios');

router.get('/servicios',controller.get_servicio);

module.exports = router;