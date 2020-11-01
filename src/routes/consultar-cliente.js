const express = require('express');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const pool = require('../database');

router.get('/consultar-cliente',isnotlogedin,async(req,res)=>{
  const contribuyente = await pool.query("SELECT * FROM contribuyente");
  const cliente = await pool.query("SELECT * FROM cliente");
  res.render('consultar-cliente/consultar-cliente',{contribuyente,cliente});
})


module.exports = router;