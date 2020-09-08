const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const express = require('express');
const router = express.Router();

router.get('/configuracion',isnotlogedin,async(req,res)=>{
  res.render('configuracion/configuracion');
});

module.exports = router;