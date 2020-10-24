const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');

router.get('/',isnotlogedin,async(req,res)=>{
  //*Querying tables
  const entrada = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'entrada' and estado=1")
  const segundo = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'segundo' and estado=1")
  const producto = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'producto' and estado=1")
  const comanda = await pool.query("SELECT * FROM venta");
  res.render('registrar-comanda/registrar-comanda',{entrada,segundo,producto,comanda});
})

router.post('/',isnotlogedin,async(req,res)=>{
  console.log(req.body);
  const {num_mesa,nombre_segundo,nombre_entrada} = req.body;
})

router.get('/view/:cod_ven',isnotlogedin,async(req,res)=>{
  const {cod_ven} = req.params;
  const comanda = await pool.query("SELECT `venta`.`cod_ven`,`venta`.`num_mesa`,`venta`.`fecha_venta`, `carta`.`nombre`,COUNT(`detalle_carta`.`cod_carta`) AS cantidad, `carta`.`categoria`,`carta`.`pathname` FROM `venta` LEFT JOIN `detalle_carta` ON `detalle_carta`.`cod_ven` = `venta`.`cod_ven` LEFT JOIN `carta` ON `detalle_carta`.`cod_carta` = `carta`.`cod_carta` WHERE `venta`.`cod_ven`=? GROUP BY `carta`.`nombre`",[cod_ven]);
  const venta = await pool.query("SELECT num_mesa FROM venta WHERE cod_ven=?",[cod_ven])
  console.log(comanda);
  res.render('registrar-comanda/view',{comanda,venta:venta[0]});
})
module.exports = router;