const express = require('express');
const router = express.Router();
const pool = require('../database');
const controller = require('../controllers/carta');

router.get('/',controller.get_carta);
router.get('/detalle-item/:cod_carta',controller.get_detalle_item);
router.post('/detalle-item/:cod_carta',controller.post_detalle_item);

module.exports = router;