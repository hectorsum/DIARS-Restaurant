const express = require('express');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const controller = require('../controllers/consultar-cliente');

router.get('/consultar-cliente',isnotlogedin,controller.get_cliente);

module.exports = router;