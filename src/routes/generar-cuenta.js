const express = require('express');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');
const controller = require('../controllers/generar-cuenta');

router.get('/', isnotlogedin, controller.get_venta);
router.post('/', isnotlogedin, controller.post_venta);
router.get('/edit/:cod_ven', isnotlogedin, controller.get_edit_venta);
router.post('/edit/:cod_ven', isnotlogedin, controller.post_edit_venta);
router.get('/print/:cod_ven', isnotlogedin, controller.get_pdf);

module.exports = router;