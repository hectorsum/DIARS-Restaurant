const controller = {};
const pool = require('../database');

controller.get_index = async(req,res)=>{
  //* Aiming layouts/index for webpage
  const carta = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'producto' and estado=1");
  const equipo = await pool.query("SELECT `empleado`.*, `rol`.`rol_nombre` FROM `empleado` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol` WHERE rol.rol_nombre='chef'");
  res.render('web/index',{equipo,carta,layout:'index'});
}

module.exports = controller;