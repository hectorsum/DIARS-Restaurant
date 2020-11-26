const pool = require('../database');
const express = require('express');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();
const {encryptpassword,decryptpassword} = require('../lib/helpers');

router.get('/',isnotlogedin,async(req,res)=>{
  const usuario_emp = await pool.query('SELECT * FROM usuarios WHERE estado_cuenta=0')
  res.render('mantener-usuario/mantener-usuario',{usuario_emp});
})

router.get('/add',isnotlogedin,async(req,res)=>{
  const empleado = await pool.query('SELECT * FROM empleados WHERE estado_cuenta=1');
  res.render('mantener-usuario/add',{empleado});
})

router.post('/add',isnotlogedin,async(req,res)=>{
  const {dni,usuario,password} = req.body;
  const new_password = await encryptpassword(password);
  console.log(new_password);
  await pool.query('call insert_user(?,?,?)',[dni,usuario,new_password],async(err,resp,fields)=>{
    if (err) {
      req.flash('failure', "No se pudo agregar" + err);
      console.log(err);
      res.redirect('/mantener-usuario/add');
    }
    else {
        req.flash('success', 'Registrado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/mantener-usuario');
    }
  });
})

router.get('/edit/:cod_usuario_emp',isnotlogedin,async(req,res)=>{
  const {cod_usuario_emp} = req.params;
  const usuario_emp = await pool.query('SELECT * FROM usuarios WHERE cod_usuario_emp=?',[cod_usuario_emp]);
  res.render('mantener-usuario/edit',{usuario_emp:usuario_emp[0]});
});

router.post('/edit/:cod_usuario_emp',isnotlogedin,async(req,res)=>{
  const {cod_usuario_emp} = req.params;
  const {usuario,password} = req.body;
  const data = {
    usuario,
    password
  }
  await pool.query('UPDATE usuario_emp SET ? WHERE cod_usuario_emp=?',[data,cod_usuario_emp],async(err)=>{
    if (err){
      req.flash('failure','No se pudo modificar');
      res.redirect(`/mantener-usuario/edit/${cod_usuario_emp}`);
    }else{
      req.flash('success','Modificado Satisfactoriamente');
      res.redirect('/mantener-usuario');
    }
  })
});

router.get('/delete/:cod_usuario_emp',isnotlogedin,async(req,res)=>{
  const {cod_usuario_emp} = req.params;
  await pool.query('call delete_user(?)',cod_usuario_emp, (err, resp, fields) => {
    if (err) {
      req.flash('failure', "No se pudo eliminar");
      res.redirect('/mantener-usuario');
    }
    else {
      req.flash('success', 'Eliminado Satisfactoriamente');
      res.redirect('/mantener-usuario');
    }
  });
})

module.exports = router;