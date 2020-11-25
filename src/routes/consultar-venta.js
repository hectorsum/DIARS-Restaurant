const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const helpers = require('../lib/helpers');

router.get('/consultar-venta',isnotlogedin,async(req,res)=>{
  const venta = await pool.query("SELECT * FROM venta_restaurante");
  const venta_delivery = await pool.query("SELECT * FROM venta_delivery");
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