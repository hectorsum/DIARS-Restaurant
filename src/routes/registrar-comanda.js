const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');

router.get('/',isnotlogedin,async(req,res)=>{
  //*Querying tables
  const venta = await pool.query("SELECT `venta`.*, `tipo_pago`.`nombre` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` ORDER BY `venta`.`cod_ven` DESC")
  const entrada = await pool.query('SELECT * FROM entrada')
  const segundo = await pool.query('SELECT * FROM segundo')
  const producto = await pool.query('SELECT * FROM producto')
  const tipo_pago = await pool.query('SELECT * FROM tipo_pago')
  const usuario_emp = await pool.query("SELECT `usuario_emp`.`cod_emp`, `empleado`.`nombres`, `empleado`.`apellidos` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp`")
  res.render('registrar-comanda/registrar-comanda',{venta,entrada,segundo,producto,tipo_pago,usuario_emp});
})

module.exports = router;