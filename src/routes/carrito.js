const express = require('express');
const router = express.Router();
const controller = require('../controllers/carrito');

router.get('/carrito', controller.get_carrito);
router.post('/carrito', controller.post_carrito);

module.exports = router