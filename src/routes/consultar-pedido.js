const express = require('express');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const controller = require('../controllers/consultar-pedido');

router.get('/',isnotlogedin, controller.get_pedido);
router.get('/checked/:cod_ven', isnotlogedin, controller.get_checked);

module.exports = router;