const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin}=require('../lib/out');
const uploadImage = require('../lib/multer');
const e = require('express');
router.get('/',isnotlogedin,async(req,res)=>{
  const carta = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'producto' and estado=1");
  res.render('mantener-producto/mantener-producto',{carta});
});

router.get('/add',isnotlogedin,async(req,res)=>{
  res.render('mantener-producto/add');
})

router.post('/add',isnotlogedin,async(req,res)=>{
  uploadImage(req,res,async(err)=>{
    if(err){
      req.flash('failure','No se pudo agregar el producto Error: '+err);
      res.redirect('/mantener-producto');
    }else{
      const {nombre,precio,stock} = req.body;
      const pathname = req.file.filename;
      console.log(req.file.filename);
      const producto = {
        nombre,
        precio,
        categoria:'producto',
        stock,
        pathname
      }
      await pool.query('INSERT INTO carta set ?',[producto],async(err,resp)=>{
        if (err) {
          req.flash('failure', "No se pudo agregar el producto" + err);
          res.redirect('/mantener-producto');
        }
        else{
          req.flash('success', 'Registrado Satisfactoriamente');
          res.redirect('/mantener-producto')  
        }
      });
    }
  })
  // await pool.query('call insert_product(?,?,?)',[nombre_producto,precio,stock],async(err,resp)=>{
  //   if (err) {
  //     req.flash('failure', "No se pudo agregar el producto" + err);
  //     res.redirect('/mantener-producto');
  //   }
  //   else {
  //       req.flash('success', 'Registrado Satisfactoriamente');
  //       console.log('finished inserting')
  //       res.redirect('/mantener-producto');
  //   }
  // });
});

router.get('/edit/:cod_prod',isnotlogedin,async(req,res)=>{
  const {cod_prod} = req.params;
  const producto = await pool.query("SELECT `producto`.*, `stock`.`stock_total` FROM `producto` LEFT JOIN `stock` ON `producto`.`cod_stock` = `stock`.`cod_stock` WHERE producto.cod_prod=?",[cod_prod]);
  res.render('mantener-producto/edit',{producto:producto[0]});
})

router.post('/edit/:cod_prod',async(req,res)=>{
  const {cod_prod} = req.params;
  const {nombre_producto,precio,stock} = req.body;
  
  await pool.query('call update_product(?,?,?,?)',[nombre_producto,precio,stock,cod_prod],async(err,resp)=>{
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


router.get('/delete/:cod_prod',isnotlogedin,async(req,res)=>{
  const {cod_prod} = req.params;
  console.log(req.params)
  await pool.query(`call delete_producto(?)`,[cod_prod], (err, resp, fields) => {
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