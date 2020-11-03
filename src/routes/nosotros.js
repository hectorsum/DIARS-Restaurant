const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/nosotros',(req,res)=>{
  res.render('web/nosotros')
})

module.exports = router;