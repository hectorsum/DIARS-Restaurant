const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const helpers = require('../lib/helpers');

router.get('/consultar-venta',isnotlogedin,async(req,res)=>{
  const venta = await pool.query("SELECT `venta`.*, `tipo_pago`.`nombre_tipo_pago`, `tipo_comprobante`.`nombre_comprobante` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` LEFT JOIN `tipo_comprobante` ON `venta`.`cod_tipo_comprobante` = `tipo_comprobante`.`cod_tipo_comprobante`;");
  res.render('consultar-venta/consultar-venta',{venta});
})

module.exports = router