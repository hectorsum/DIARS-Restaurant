const express = require('express');
const router = express.Router();
const { isnotlogedin, islogedin } = require('../lib/out');
const controller = require('../controllers/mantener-empleado');

router.get('/', isnotlogedin, controller.get_empleado);
router.get('/add', isnotlogedin, controller.get_add_empleado);
router.post('/add', isnotlogedin, controller.post_add_empleado);
router.get('/edit/:cod_emp', isnotlogedin, controller.get_edit_empleado);
router.post('/edit/:cod_emp',isnotlogedin, controller.post_edit_empleado);
router.get('/delete/:cod_emp', isnotlogedin,controller.get_delete_empleado);

module.exports = router;