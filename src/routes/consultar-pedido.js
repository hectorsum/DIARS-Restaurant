const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const helpers = require('../lib/helpers');

router.get('/',isnotlogedin ,async(req,res)=>{
  const venta_delivery = await pool.query("SELECT * FROM venta_pedidos");
  res.render('consultar-pedido/consultar-pedido',{venta_delivery})
})

router.get('/checked/:cod_ven', isnotlogedin, async(req, res) => {
  const { cod_ven } = req.params;
  await pool.query(`UPDATE venta SET estado=0 WHERE cod_ven=${cod_ven}`, (err, resp) => {
      if (err) {
          req.flash('failure', "Hubo un error");
          res.redirect('/consultar-pedido');
      } else {
          req.flash('success', 'Entrega realizada');
          res.redirect('/consultar-pedido');
      }
  });
})

module.exports = router;