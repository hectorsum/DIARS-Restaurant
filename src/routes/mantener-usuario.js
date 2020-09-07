const pool = require('../database');
const express = require('express');
const {isnotlogedin} = require('../lib/out');
const router = express.Router();

router.get('/',isnotlogedin,async(req,res)=>{
  const usuario_emp = await pool.query('SELECT `usuario_emp`.*, `empleado`.*, `rol`.`rol_nombre` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol`;')
  res.render('mantener-usuario/mantener-usuario',{usuario_emp});
})

router.get('/add',isnotlogedin,async(req,res)=>{
  const empleado = await pool.query('SELECT `empleado`.*, `rol`.`rol_nombre`, `rol`.`rol_nombre` FROM `empleado` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol` WHERE estado_cuenta=1');
  res.render('mantener-usuario/add',{empleado});
})

router.post('/add',isnotlogedin,async(req,res)=>{
  const {dni,usuario,password} = req.body;
  await pool.query('call insert_user(?,?,?)',[dni,usuario,password],async(err,resp,fields)=>{
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


module.exports = router;