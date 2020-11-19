const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/',(req,res)=>{
  res.render('web/carrito',{layout:'index'})
})
router.post('/',(req,res)=>{
  console.log(req.body);
})
module.exports = router