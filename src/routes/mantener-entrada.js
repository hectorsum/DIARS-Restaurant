const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const uploadImage = require('../lib/multer');

router.get('/',isnotlogedin,async(req,res)=>{
  const carta = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'entrada' and estado=1");
  res.render('mantener-entrada/mantener-entrada',{carta});
})

router.get('/add',isnotlogedin,async(req,res)=>{
  res.render('mantener-entrada/add');
})

router.post('/add',isnotlogedin,async(req,res)=>{
  uploadImage(req,res,async(err)=>{
    if(err){
      req.flash('failure','No se pudo agregar Error: '+err);
      res.redirect('/mantener-entrada');
    }else{
      let {nombre,precio,stock,lleva_pollo,descripcion} = req.body;
      console.log(req.file.filename)
      lleva_pollo = (lleva_pollo) ? 1 : 0;
      const pathname = req.file.filename;
      console.log(pathname);
      await pool.query('call add_mantener(?,?,?,?,?,?,?)',[nombre,precio,'entrada',stock,pathname,lleva_pollo,descripcion],async(err,resp)=>{
        if (err) {
          req.flash('failure', "No se pudo agregar" + err);
          res.redirect('/mantener-entrada');
        }
        else{
          req.flash('success', 'Registrado Satisfactoriamente');
          res.redirect('/mantener-entrada')  
        }
      });
    }
  })
});

router.get('/edit/:cod_carta',isnotlogedin,async(req,res)=>{
  const {cod_carta} = req.params;
  const carta = await pool.query("SELECT * FROM carta WHERE carta.cod_carta=?",[cod_carta]);
  console.log(carta[0]);
  res.render('mantener-entrada/edit',{carta:carta[0]});
})

router.post('/edit/:cod_carta', isnotlogedin, async(req,res)=>{
  uploadImage(req, res, async (err) => {
    if (err) {
        req.flash('failure', "Could't update room type" + err);
        res.redirect('/roomtype');
    }
    else {
        const { cod_carta } = req.params;
        let {nombre,precio,stock,lleva_pollo,descripcion} = req.body;
        console.log(req.file);
        lleva_pollo = (lleva_pollo) ? 1 : 0;
        var new_entrada = {
          nombre,
          precio,
          stock,
          lleva_pollo,
          descripcion
        };
        if (req.file != undefined) {
            const pathname = req.file.filename;
            new_entrada = {
                nombre,
                precio,
                stock,
                lleva_pollo,
                descripcion,
                pathname
            };
        }
        await pool.query('UPDATE carta SET ? WHERE cod_carta=?', [new_entrada, cod_carta], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "No se pudo actualizar" + err);
                res.redirect('/mantener-entrada');
            }
            else {
                req.flash('success', 'Actualizado Satisfactoriamente');
                res.redirect('/mantener-entrada');
            }
        });
    }
  })
})

router.get('/delete/:cod_carta',isnotlogedin,async(req,res)=>{
  const {cod_carta} = req.params;
  console.log(req.params)
  await pool.query(`UPDATE carta SET estado=0 WHERE cod_carta=?`,[cod_carta], (err, resp, fields) => {
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