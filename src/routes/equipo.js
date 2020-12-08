const express = require('express');
const router = express.Router();
const controller = require('../controllers/equipo');

router.get('/equipo',controller.get_equipo);

module.exports = router;