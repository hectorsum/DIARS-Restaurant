const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const helpers = require('../lib/helpers');

router.get('/consultar-venta',isnotlogedin,async(req,res)=>{
  const venta = await pool.query("SELECT `venta`.*, `tipo_pago`.`nombre_tipo_pago`, `tipo_comprobante`.`nombre_comprobante` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` LEFT JOIN `tipo_comprobante` ON `venta`.`cod_tipo_comprobante` = `tipo_comprobante`.`cod_tipo_comprobante` WHERE tipo_venta='local'");
  const venta_delivery = await pool.query("SELECT `venta`.*, `tipo_pago`.`nombre_tipo_pago`, `tipo_comprobante`.`nombre_comprobante` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` LEFT JOIN `tipo_comprobante` ON `venta`.`cod_tipo_comprobante` = `tipo_comprobante`.`cod_tipo_comprobante` WHERE tipo_venta='delivery' and estado=0");
  res.render('consultar-venta/consultar-venta',{venta,venta_delivery});
})

//pdf
router.get('/print/:cod_ven', isnotlogedin, async(req, res) => {
  try {
      const { cod_ven } = req.params;
      var npdf = await pdf.boleta(cod_ven);
      console.log('ERROR HERE: ', npdf)
      res.contentType("application/pdf");
      res.send(npdf);
  } catch (e) {
      console.log(e);
  }
});

module.exports = router