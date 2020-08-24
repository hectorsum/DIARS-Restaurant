const express = require('express');
const pool = require('../database');
const helpers = require('../lib/helpers');
const router = express.Router();
const {islogedin,isnotlogedin}=require('../lib/out');

router.get('/',isnotlogedin,async(req,res)=>{
  const producto = await pool.query("SELECT `producto`.*, `stock`.`stock_total` FROM `producto` LEFT JOIN `stock` ON `producto`.`cod_stock` = `stock`.`cod_stock` WHERE `producto`.`cod_prod` != 0 && `producto`.`ocultar`!=0");
  res.render('mantener-producto/mantener-producto',{producto});
});

router.post('/',isnotlogedin,async(req,res)=>{
  const {nombre_producto,precio,stock} = req.body;
  await pool.query('call insert_product(?,?,?)',[nombre_producto,precio,stock],async(err,resp,fields)=>{
    if (err) {
      req.flash('failure', "No se pudo agregar el producto" + err);
      res.redirect('/mantener-producto');
    }
    else {
        req.flash('success', 'Registrado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/mantener-producto');
    }
  });
});

router.get('/edit/:cod_prod',isnotlogedin,async(req,res)=>{
  const {cod_prod} = req.params;
  const producto = await pool.query("SELECT `producto`.*, `stock`.`stock_total` FROM `producto` LEFT JOIN `stock` ON `producto`.`cod_stock` = `stock`.`cod_stock` WHERE producto.cod_prod=?",[cod_prod]);
  res.render('mantener-producto/edit',{producto:producto[0]});
})

router.post('/edit/:cod_prod',async(req,res)=>{
  const {cod_prod} = req.params;
  const {nombre_producto,precio,stock} = req.body;
  
  await pool.query('call update_product(?,?,?,?)',[nombre_producto,precio,stock,cod_prod],async(err,resp,fields)=>{
    if (err) {
      req.flash('failure', "No se pudo agregar el producto" + err);
      res.redirect('/mantener-producto');
      console.log(err)
    }
    else {
        req.flash('success', 'Registrado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/mantener-producto');
    }
  });
})


router.get('/delete/:cod_prod',isnotlogedin,async(req,res)=>{
  const {cod_prod} = req.params;
  console.log(req.params)
  await pool.query(`UPDATE producto SET ocultar=0 WHERE cod_prod=${cod_prod}`, (err, resp, fields) => {
    if (err) {
        req.flash('failure', "No se pudo eliminar producto");
        res.redirect('/mantener-producto');
        console.log(err)
    }
    else {
        req.flash('success_delete', 'Producto Eliminado');
        res.redirect('/mantener-producto');
    }
  });
});
module.exports = router;