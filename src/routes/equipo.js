const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/equipo',async(req,res)=>{
  const equipo = await pool.query("SELECT `empleado`.*, `rol`.`rol_nombre` FROM `empleado` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol` WHERE rol.rol_nombre='chef'")
  console.log(equipo)
  res.render('web/equipo',{layout:'index',equipo});
})

module.exports = router;