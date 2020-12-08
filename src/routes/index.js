const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/',async (req,res)=>{
  //* Aiming layouts/index for webpage
  const carta = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'producto' and estado=1");
  const equipo = await pool.query("SELECT `empleado`.*, `rol`.`rol_nombre` FROM `empleado` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol` WHERE rol.rol_nombre='chef'");
  console.log(equipo);
  res.render('web/index',{equipo,carta,layout:'index'});
});


module.exports = router;