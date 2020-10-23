const express = require('express');
const pool = require('../database');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();
const uploadImage = require('../lib/multer');

router.get('/',isnotlogedin, async(req,res)=>{
  const carta = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'segundo' and estado=1");
  res.render('mantener-segundo/mantener-segundo',{carta});
})

router.get('/add',isnotlogedin, async(req,res)=>{
  res.render('mantener-segundo/add');
})

router.post('/add',isnotlogedin,async(req,res)=>{
  uploadImage(req,res,async(err)=>{
    if(err){
      req.flash('failure','No se pudo agregar Error: '+err);
      res.redirect('/mantener-segundo');
    }else{
      const {nombre,precio,stock} = req.body;
      const pathname = req.file.filename;
      console.log(req.file.filename);
      await pool.query('call add_mantener(?,?,?,?,?)',[nombre,precio,'segundo',stock,pathname],async(err,resp)=>{
        if (err) {
          req.flash('failure', "No se pudo agregar" + err);
          res.redirect('/mantener-segundo');
        }
        else{
          req.flash('success', 'Registrado Satisfactoriamente');
          res.redirect('/mantener-segundo')  
        }
      });
    }
  })
})

router.get('/edit/:cod_carta',isnotlogedin,async(req,res)=>{
  const {cod_carta} = req.params;
  const carta = await pool.query("SELECT * FROM carta WHERE carta.cod_carta=?",[cod_carta]);
  console.log(carta[0]);
  res.render('mantener-segundo/edit',{carta:carta[0]});
})

router.post('/edit/:cod_carta',async(req,res)=>{
  uploadImage(req, res, async (err) => {
    if (err) {
        req.flash('failure', "No se pudo actualizar, Error:" + err);
        res.redirect('/mantener-segundo');
    }
    else {
        const { cod_carta } = req.params;
        const {nombre,precio,stock} = req.body;
        console.log(req.file);
        var new_segundo = {
          nombre,
          precio,
          stock
        };
        if (req.file != undefined) {
            const pathname = req.file.filename;
            new_segundo = {
                nombre,
                precio,
                stock,
                pathname
            };
        }
        await pool.query('UPDATE carta SET ? WHERE cod_carta=?', [new_segundo, cod_carta], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "No se pudo actualizar" + err);
                res.redirect('/mantener-segundo');
            }
            else {
                req.flash('success', 'Actualizado Satisfactoriamente');
                res.redirect('/mantener-segundo');
            }
        });
    }
  })
})

router.get('/delete/:cod_carta',isnotlogedin,async(req,res)=>{
  const {cod_carta} = req.params;
  console.log(req.params)
  await pool.query(`UPDATE carta SET estado=0 WHERE cod_carta=?`,[cod_carta], (err, resp) => {
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