const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/equipo',(req,res)=>{
  res.render('web/equipo',{layout:'index'})
})

module.exports = router;