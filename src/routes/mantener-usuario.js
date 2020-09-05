const pool = require('../database');
const express = require('express');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();

router.get('/',isnotlogedin,async(req,res)=>{
  const usuario_emp = await pool.query('SELECT `usuario_emp`.*, `empleado`.*, `rol`.`rol_nombre` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol`;')
  res.render('mantener-usuario/mantener-usuario',{usuario_emp});
})

router.get('/add',isnotlogedin,async(req,res)=>{
  const rol = await pool.query('SELECT * FROM rol');
  res.render('mantener-usuario/add',{rol});
})


module.exports = router;