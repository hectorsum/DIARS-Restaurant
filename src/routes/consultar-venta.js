const express = require('express');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const controller = require('../controllers/consultar-venta');

router.get('/consultar-venta',isnotlogedin, controller.get_venta);
router.get('/print/:cod_ven', isnotlogedin, controller.get_pdf);

module.exports = router