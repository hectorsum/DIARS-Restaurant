const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');

router.get('/',isnotlogedin,async(req,res)=>{
  const entrada = await pool.query("SELECT `entrada`.*, `stock`.`stock_total` FROM `entrada` LEFT JOIN `stock` ON `entrada`.`cod_stock` = `stock`.`cod_stock` WHERE `entrada`.`cod_entrada` != 0 && `entrada`.`ocultar`!=0");
  res.render('mantener-entrada/mantener-entrada',{entrada});
})

router.get('/add',isnotlogedin,async(req,res)=>{
  const entrada = await pool.query("SELECT `entrada`.*, `stock`.`stock_total` FROM `entrada` LEFT JOIN `stock` ON `entrada`.`cod_stock` = `stock`.`cod_stock` WHERE `entrada`.`cod_entrada` != 0 && `entrada`.`ocultar`=0");
  res.render('mantener-entrada/add',{entrada});
})

router.post('/add',isnotlogedin,async(req,res)=>{
  const {nombre_entrada,precio,stock} = req.body;
  await pool.query('call insert_entrada(?,?,?)',[nombre_entrada,precio,stock],async(err,resp,fields)=>{
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

router.get('/edit/:cod_entrada',isnotlogedin,async(req,res)=>{
  const {cod_entrada} = req.params;
  const entrada = await pool.query("SELECT `entrada`.*, `stock`.`stock_total` FROM `entrada` LEFT JOIN `stock` ON `entrada`.`cod_stock` = `stock`.`cod_stock` WHERE entrada.cod_entrada=?",[cod_entrada]);
  res.render('mantener-entrada/edit',{entrada:entrada[0]});
})

router.post('/edit/:cod_entrada',async(req,res)=>{
  const {cod_entrada} = req.params;
  const {nombre_entrada,precio,stock} = req.body;
  
  await pool.query('call update_entrada(?,?,?,?)',[nombre_entrada,precio,stock,cod_entrada],async(err,resp,fields)=>{
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


router.get('/hide/:cod_entrada',isnotlogedin,async(req,res)=>{
  const {cod_entrada} = req.params;
  console.log(req.params)
  await pool.query(`UPDATE entrada SET ocultar=0 WHERE cod_entrada=${cod_entrada}`, (err, resp, fields) => {
    if (err) {
        req.flash('failure', "No se pudo ocultar");
        res.redirect('/mantener-entrada');
        console.log(err)
    }
    else {
        req.flash('success_delete', 'Ocultado Satisfactoriamente');
        res.redirect('/mantener-entrada');
    }
  });
});

router.get('/unhide/:cod_entrada',isnotlogedin,async(req,res)=>{
  const {cod_entrada} = req.params;
  console.log(req.params)
  await pool.query(`UPDATE entrada SET ocultar=1 WHERE cod_entrada=${cod_entrada}`, (err, resp, fields) => {
    if (err) {
        req.flash('failure', "No se pudo Desocultar");
        res.redirect('/mantener-entrada');
        console.log(err)
    }
    else {
        req.flash('success_delete', 'Desocultado Satisfactoriamente');
        res.redirect('/mantener-entrada');
    }
  });
});

module.exports = router;