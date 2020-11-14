const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/servicios',(req,res)=>{
  res.render('web/servicios',{layout:'index'})
})

module.exports = router;