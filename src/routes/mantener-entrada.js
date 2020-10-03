const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');

router.get('/',isnotlogedin,async(req,res)=>{
  const entrada = await pool.query("SELECT `entrada`.*, `stock`.`stock_total` FROM `entrada` LEFT JOIN `stock` ON `entrada`.`cod_stock` = `stock`.`cod_stock` WHERE `entrada`.`codigo` != 0 && `entrada`.`ocultar`!=0");
  res.render('mantener-entrada/mantener-entrada',{entrada});
})

router.get('/add',isnotlogedin,async(req,res)=>{
  res.render('mantener-entrada/add');
})

router.post('/add',isnotlogedin,async(req,res)=>{
  const {nombre_entrada,precio,stock} = req.body;
  await pool.query('call insert_entrada(?,?,?)',[nombre_entrada,precio,stock],async(err,resp)=>{
    if (err) {
      console.log(err);
      req.flash('failure', "No se pudo agregar la entrada" + err);
      res.redirect('/mantener-entrada');
    }
    else {
        req.flash('success', 'Registrado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/mantener-entrada');
    }
  });
});

router.get('/edit/:codigo',isnotlogedin,async(req,res)=>{
  const {codigo} = req.params;
  const entrada = await pool.query("SELECT `entrada`.*, `stock`.`stock_total` FROM `entrada` LEFT JOIN `stock` ON `entrada`.`cod_stock` = `stock`.`cod_stock` WHERE entrada.codigo=?",[codigo]);
  res.render('mantener-entrada/edit',{entrada:entrada[0]});
})

router.post('/edit/:codigo', isnotlogedin, async(req,res)=>{
  const {codigo} = req.params;
  const {nombre_entrada,precio,stock} = req.body;
  
  await pool.query('call update_entrada(?,?,?,?)',[nombre_entrada,precio,stock,codigo],async(err,resp)=>{
    if (err) {
      req.flash('failure', "No se pudo modificar la entrada" + err);
      res.redirect('/mantener-entrada');
      console.log(err)
    }
    else {
        req.flash('success', 'Modificado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/mantener-entrada');
    }
  });
})

router.get('/delete/:codigo',isnotlogedin,async(req,res)=>{
  const {codigo} = req.params;
  console.log(req.params)
  await pool.query(`call delete_entrada(?)`,[codigo], (err, resp, fields) => {
    console.log(resp,fields);
    if (err) {
        req.flash('failure', "No se pudo eliminar");
        res.redirect('/mantener-entrada');
        console.log(err)
    }
    else {
        req.flash('success', 'Eliminado Satisfactoriamente');
        res.redirect('/mantener-entrada');
    }
  });
});

module.exports = router;