const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const helpers = require('../lib/helpers');

router.get('/consultar-pedido',isnotlogedin ,async(req,res)=>{
  const venta_delivery = await pool.query("SELECT DISTINCT (venta.fecha_venta),`venta`.cod_ven,`venta`.total, `cliente`.`nombre`,`cliente`.`apellido`,cliente.dni,`cliente`.`direccion`,`cliente`.`distrito`,`cliente`.`dni` FROM `venta` LEFT JOIN `detalle_carta` ON `detalle_carta`.`cod_ven` = `venta`.`cod_ven` LEFT JOIN `cliente` ON `venta`.`cod_cli` = `cliente`.`cod_cli` WHERE venta.tipo_venta='delivery' and venta.estado=1");
  res.render('consultar-pedido/consultar-pedido',{venta_delivery})
})

router.get('/checked/:cod_ven', isnotlogedin, async(req, res) => {
  const { cod_ven } = req.params;
  await pool.query(`UPDATE venta SET estado=0 WHERE cod_ven=${cod_ven}`, (err, resp) => {
      if (err) {
          req.flash('failure', "Hubo un error");
          res.redirect('/consultar-delivery');
      } else {
          req.flash('success', 'Entrega realizada');
          res.redirect('/consultar-delivery');
      }
  });
})

module.exports = router;