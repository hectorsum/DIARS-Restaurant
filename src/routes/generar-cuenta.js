const express = require('express');
const pool = require('../database');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/generar-cuenta',isnotlogedin,async(req,res)=>{
  const venta = await pool.query('SELECT * FROM venta')
  res.render('generar-cuenta/generar-cuenta',{venta})
})

// router.post('/generar-cuenta', async(req,res)=>{

// })

module.exports = router;