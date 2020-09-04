const express = require('express');
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();

router.get('/',isnotlogedin, async(req,res)=>{
  const segundo = await pool.query("SELECT `segundo`.*, `stock`.`stock_total` FROM `segundo` LEFT JOIN `stock` ON `segundo`.`cod_stock` = `stock`.`cod_stock` WHERE `segundo`.`cod_segundo` != 0 && `segundo`.`ocultar`!=0");
  res.render('mantener-segundo/mantener-segundo',{segundo});
})

router.get('/add',isnotlogedin, async(req,res)=>{
  const segundo = await pool.query("SELECT `segundo`.*, `stock`.`stock_total` FROM `segundo` LEFT JOIN `stock` ON `segundo`.`cod_stock` = `stock`.`cod_stock` WHERE `segundo`.`cod_segundo` != 0 && `segundo`.`ocultar`=0");
  res.render('mantener-segundo/add',{segundo});
})

router.post('/add',isnotlogedin,async(req,res)=>{
  const {nombre_segundo,precio,stock} = req.body;
  await pool.query('call insert_segundo(?,?,?)',[nombre_segundo,precio,stock],async(err,resp,fields)=>{
    if(err){
      req.flash('failure',`No se pudo agregar el segundo ${err}`);
      res.redirect('/mantener-segundo');
    }else{
      req.flash('success','Registrado satisfactoriamente');
      res.redirect('/mantener-segundo');
    }
  })
})

router.get('/edit/:cod_segundo',isnotlogedin,async(req,res)=>{
  const {cod_segundo} = req.params;
  const segundo = await pool.query("SELECT `segundo`.*, `stock`.`stock_total` FROM `segundo` LEFT JOIN `stock` ON `segundo`.`cod_stock` = `stock`.`cod_stock` WHERE segundo.cod_segundo=?",[cod_segundo]);
  res.render('mantener-segundo/edit',{segundo:segundo[0]});
})

router.post('/edit/:cod_segundo',async(req,res)=>{
  const {cod_segundo} = req.params;
  const {nombre_segundo,precio,stock} = req.body;
  
  await pool.query('call update_segundo(?,?,?,?)',[nombre_segundo,precio,stock,cod_segundo],async(err,resp,fields)=>{
    if (err) {
      req.flash('failure', "No se pudo agregar el segundo" + err);
      res.redirect('/mantener-segundo');
      console.log(err)
    }
    else {
        req.flash('success', 'Modificado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/mantener-segundo');
    }
  });
})

router.get('/hide/:cod_segundo',isnotlogedin,async(req,res)=>{
  const {cod_segundo} = req.params;
  console.log(req.params)
  await pool.query(`UPDATE segundo SET ocultar=0 WHERE cod_segundo=${cod_segundo}`, (err, resp, fields) => {
    if (err) {
        req.flash('failure', "No se pudo ocultar");
        res.redirect('/mantener-segundo');
        console.log(err)
    }
    else {
        req.flash('success', 'Ocultado Satisfactoriamente');
        res.redirect('/mantener-segundo');
    }
  });
});

router.get('/unhide/:cod_segundo',isnotlogedin,async(req,res)=>{
  const {cod_segundo} = req.params;
  console.log(req.params)
  await pool.query(`UPDATE segundo SET ocultar=1 WHERE cod_segundo=${cod_segundo}`, (err, resp, fields) => {
    if (err) {
        req.flash('failure', "No se pudo ocultar");
        res.redirect('/mantener-segundo');
        console.log(err)
    }
    else {
        req.flash('success', 'Ocultado Satisfactoriamente');
        res.redirect('/mantener-segundo');
    }
  });
});

module.exports = router;