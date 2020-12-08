const express = require('express');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();
const controller = require('../controllers/mantener-usuario');

router.get('/',isnotlogedin,controller.get_usuario);
router.get('/add',isnotlogedin,controller.get_add_usuario);
router.post('/add',isnotlogedin,controller.post_add_usuario);
router.get('/edit/:cod_usuario_emp',isnotlogedin,controller.get_edit_usuario);
router.post('/edit/:cod_usuario_emp',controller.post_edit_usuario);
router.get('/delete/:cod_usuario_emp',isnotlogedin,controller.get_delete_usuario);

module.exports = router;