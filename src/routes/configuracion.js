const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const express = require('express');
const helpers = require('../lib/helpers');
const router = express.Router();
const jsdom = require("jsdom");
const d3 = require("d3");


router.get('/configuracion',isnotlogedin,async(req,res)=>{
  const ubdepartamento	 = pool.query('SELECT * FROM ubdepartamento');
  res.render('configuracion/configuracion',{ubdepartamento});
});

router.post('/configuracion',isnotlogedin,async(req,res)=>{
  const { nombre_restaurant,direccion,email,departamento,provincia,distrito } = req.body;
  jsdom.env(window.location.href,function(err,windows){
    if (error) throw error;
    console.log(d3.select(windows.document).select("#seleccionar-departamento"));
  })
});
module.exports = router;