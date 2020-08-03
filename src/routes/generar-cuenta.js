const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/generar-cuenta',isnotlogedin,(req,res)=>{
  res.render('generar-cuenta/generar-cuenta')
})

module.exports = router;