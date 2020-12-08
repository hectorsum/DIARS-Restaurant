const express = require('express');
const router = express.Router();
const { isnotlogedin } = require('../lib/out');
const controller = require('../controllers/mantener-producto');

router.get('/', isnotlogedin, controller.get_producto);
router.get('/add', isnotlogedin, controller.get_add_producto);
router.post('/add', isnotlogedin, controller.post_add_producto);
router.get('/edit/:cod_carta', isnotlogedin, controller.get_edit_producto);
router.post('/edit/:cod_carta', isnotlogedin, controller.post_edit_producto);
router.get('/delete/:cod_carta', isnotlogedin, controller.get_delete_producto);

module.exports = router;