const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/',async(req,res)=>{
  const segundo = await pool.query('SELECT * from carta WHERE categoria="segundo" and estado=1')
  console.log(segundo);
  const entrada = await pool.query('SELECT * from carta WHERE categoria="entrada" and estado=1')
  console.log(segundo);
  const producto = await pool.query('SELECT * from carta WHERE categoria="producto" and estado=1')
  console.log(segundo);
  res.render('web/carta',{layout:'index',segundo,entrada,producto});
})
router.get('/detalle-item/:cod_carta',async(req,res)=>{
  const {cod_carta} = req.params;
  const carta = await pool.query("SELECT * FROM carta WHERE cod_carta=?",[cod_carta]);
  console.log(carta)
  res.render('web/detalle-item',{layout:'index',carta:carta[0]});
});
router.post('/detalle-item/:cod_carta',async(req,res)=>{
  const cod_carta = req.params;

});

module.exports = router;