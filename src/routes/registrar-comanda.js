const express = require('express');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const controller = require('../controllers/registrar-comanda');

router.get('/',isnotlogedin,controller.get_comanda);
router.post('/',controller.post_comanda);
router.get('/edit/:cod_ven',isnotlogedin,controller.get_edit_comanda);
router.post('/edit/:cod_ven',controller.post_edit_comanda);
router.get('/view/:cod_ven',isnotlogedin,controller.get_view_comanda);
router.get('/delete/:cod_ven',isnotlogedin,controller.get_delete_comanda);

module.exports = router;