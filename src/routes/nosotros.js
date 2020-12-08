const express = require('express');
const router = express.Router();
const controller = require('../controllers/nosotros');

router.get('/nosotros',controller.get_nosotros);

module.exports = router;