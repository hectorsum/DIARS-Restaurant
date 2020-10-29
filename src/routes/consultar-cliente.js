const express = require('express');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const pool = require('../database');

router.get('/consultar-cliente',isnotlogedin,async(req,res)=>{
  const entrada = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'entrada' and estado=1");
  const segundo = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'segundo' and estado=1");
  console.log(segundo);
  res.render('consultar-cliente/consultar-cliente',{entrada,segundo});
})


module.exports = router;