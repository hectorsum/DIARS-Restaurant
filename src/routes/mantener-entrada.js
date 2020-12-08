const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const uploadImage = require('../lib/multer');
const controller = require('../controllers/mantener-entrada');

router.get('/',isnotlogedin,controller.get_entrada);
router.get('/add',isnotlogedin,controller.get_add_entrada);
router.post('/add',isnotlogedin,controller.post_add_entrada);
router.get('/edit/:cod_carta',isnotlogedin,controller.get_edit_entrada);
router.post('/edit/:cod_carta', isnotlogedin, controller.post_edit_entrada);
router.get('/delete/:cod_carta',isnotlogedin,controller.get_delete_entrada);

module.exports = router;