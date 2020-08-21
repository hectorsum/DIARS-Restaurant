const express = require('express');
const pool = require('../database');
const helpers = require('../lib/helpers');
const router = express.Router();
const {islogedin,isnotlogedin}=require('../lib/out');

router.get('/mantener-producto',isnotlogedin,async(req,res)=>{
  const producto = await pool.query("SELECT `producto`.*, `stock`.`stock_total` FROM `producto` LEFT JOIN `stock` ON `producto`.`cod_stock` = `stock`.`cod_stock` WHERE `producto`.`cod_prod` != 0");
  res.render('mantener-producto/mantener-producto',{producto});
});

module.exports = router;