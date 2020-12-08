const controller = {};
const pool = require('../database');

controller.get_carta = async(req,res)=>{
  const segundo = await pool.query('SELECT * from carta WHERE categoria="segundo" and estado=1')
  const entrada = await pool.query('SELECT * from carta WHERE categoria="entrada" and estado=1')
  const producto = await pool.query('SELECT * from carta WHERE categoria="producto" and estado=1')
  res.render('web/carta',{layout:'index',segundo,entrada,producto});
};

controller.get_detalle_item = async(req,res)=>{
  const {cod_carta} = req.params;
  const carta = await pool.query("SELECT * FROM carta WHERE cod_carta=?",[cod_carta]);
  const adicionales = await pool.query("SELECT * FROM carta WHERE categoria='adicionales' and estado=1");
  res.render('web/detalle-item',{layout:'index',carta:carta[0],adicionales});
};

controller.post_detalle_item = async(req,res)=>{
  res.redirect('/carta');
}

module.exports = controller;