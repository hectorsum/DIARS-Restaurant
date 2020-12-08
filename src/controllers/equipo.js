const pool = require('../database');
const controller = {};

controller.get_equipo = async(req,res)=>{
  const equipo = await pool.query("SELECT `empleado`.*, `rol`.`rol_nombre` FROM `empleado` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol` WHERE rol.rol_nombre='chef'")
  res.render('web/equipo',{layout:'index',equipo});
};

module.exports = controller;