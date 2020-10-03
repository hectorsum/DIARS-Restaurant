const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin}=require('../lib/out');

router.get('/',isnotlogedin,async(req,res)=>{
  const producto = await pool.query("SELECT `producto`.*, `stock`.`stock_total` FROM `producto` LEFT JOIN `stock` ON `producto`.`cod_stock` = `stock`.`cod_stock` WHERE `producto`.`codigo` != 0 && `producto`.`ocultar`!=0");
  res.render('mantener-producto/mantener-producto',{producto});
});

router.get('/add',isnotlogedin,async(req,res)=>{
  res.render('mantener-producto/add');
})

router.post('/add',isnotlogedin,async(req,res)=>{
  const {nombre_producto,precio,stock} = req.body;
  await pool.query('call insert_product(?,?,?)',[nombre_producto,precio,stock],async(err,resp)=>{
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

router.get('/edit/:codigo',isnotlogedin,async(req,res)=>{
  const {codigo} = req.params;
  const producto = await pool.query("SELECT `producto`.*, `stock`.`stock_total` FROM `producto` LEFT JOIN `stock` ON `producto`.`cod_stock` = `stock`.`cod_stock` WHERE producto.codigo=?",[codigo]);
  res.render('mantener-producto/edit',{producto:producto[0]});
})

router.post('/edit/:codigo',async(req,res)=>{
  const {codigo} = req.params;
  const {nombre_producto,precio,stock} = req.body;
  
  await pool.query('call update_product(?,?,?,?)',[nombre_producto,precio,stock,codigo],async(err,resp)=>{
    if (err) {
      req.flash('failure', "No se pudo agregar el producto" + err);
      res.redirect('/mantener-producto');
      console.log(err)
    }
    else {
        req.flash('success', 'Modificado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/mantener-producto');
    }
  });
})


router.get('/delete/:codigo',isnotlogedin,async(req,res)=>{
  const {codigo} = req.params;
  console.log(req.params)
  await pool.query(`call delete_producto(?)`,[codigo], (err, resp, fields) => {
    if (err) {
        req.flash('failure', "No se pudo eliminar");
        res.redirect('/mantener-producto');
        console.log(err)
    }
    else {
        req.flash('success', 'Eliminado Satisfactoriamente');
        res.redirect('/mantener-producto');
    }
  });
});
module.exports = router;