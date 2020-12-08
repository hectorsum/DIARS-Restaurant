const controller = {};
const pool = require('../database');

controller.get_cliente = async(req,res)=>{
  const contribuyente = await pool.query("SELECT * FROM contribuyente");
  const cliente = await pool.query("SELECT * FROM cliente");
  res.render('consultar-cliente/consultar-cliente',{contribuyente,cliente});
};

module.exports = controller;