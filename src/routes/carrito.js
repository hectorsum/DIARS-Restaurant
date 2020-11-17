const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/carrito',(req,res)=>{
  res.render('web/carrito')
})

module.exports = router