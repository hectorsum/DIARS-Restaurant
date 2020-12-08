const express = require('express');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();
const controller = require('../controllers/mantener-segundo');

router.get('/',isnotlogedin, controller.get_segundo);
router.get('/add',isnotlogedin,controller.get_add_segundo);
router.post('/add',isnotlogedin,controller.post_add_segundo);
router.get('/edit/:cod_carta',isnotlogedin,controller.get_edit_segundo);
router.post('/edit/:cod_carta',controller.post_edit_segundo);
router.get('/delete/:cod_carta',isnotlogedin,controller.get_delete_segundo);

module.exports = router;