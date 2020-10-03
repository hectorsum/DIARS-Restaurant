const express = require('express');
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();

router.get('/',isnotlogedin, async(req,res)=>{
  const segundo = await pool.query("SELECT `segundo`.*, `stock`.`stock_total` FROM `segundo` LEFT JOIN `stock` ON `segundo`.`cod_stock` = `stock`.`cod_stock` WHERE `segundo`.`codigo` != 0 && `segundo`.`ocultar`!=0");
  res.render('mantener-segundo/mantener-segundo',{segundo});
})

router.get('/add',isnotlogedin, async(req,res)=>{
  res.render('mantener-segundo/add');
})

router.post('/add',isnotlogedin,async(req,res)=>{
  const {nombre_segundo,precio,stock} = req.body;
  await pool.query('call insert_segundo(?,?,?)',[nombre_segundo,precio,stock],async(err,resp)=>{
    if(err){
      req.flash('failure',`No se pudo agregar el segundo ${err}`);
      res.redirect('/mantener-segundo');
    }else{
      req.flash('success','Registrado satisfactoriamente');
      res.redirect('/mantener-segundo');
    }
  })
})

router.get('/edit/:codigo',isnotlogedin,async(req,res)=>{
  const {codigo} = req.params;
  const segundo = await pool.query("SELECT `segundo`.*, `stock`.`stock_total` FROM `segundo` LEFT JOIN `stock` ON `segundo`.`cod_stock` = `stock`.`cod_stock` WHERE segundo.codigo=?",[codigo]);
  res.render('mantener-segundo/edit',{segundo:segundo[0]});
})

router.post('/edit/:codigo',async(req,res)=>{
  const {codigo} = req.params;
  const {nombre_segundo,precio,stock} = req.body;
  
  await pool.query('call update_segundo(?,?,?,?)',[nombre_segundo,precio,stock,codigo],async(err,resp)=>{
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

router.get('/delete/:codigo',isnotlogedin,async(req,res)=>{
  const {codigo} = req.params;
  await pool.query(`call delete_segundo(?)`,[codigo], (err, resp) => {
    if (err) {
        req.flash('failure', "No se pudo eliminar");
        res.redirect('/mantener-segundo');
        console.log(err)
    }
    else {
        req.flash('success', 'Eliminado Satisfactoriamente');
        res.redirect('/mantener-segundo');
    }
  });
});

module.exports = router;