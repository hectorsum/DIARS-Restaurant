const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacto');

router.get('/contacto',controller.get_contacto);

module.exports = router;