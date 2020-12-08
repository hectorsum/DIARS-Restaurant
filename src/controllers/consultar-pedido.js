const controller = {};
const pool = require('../database');

controller.get_pedido = async(req,res)=>{
  const venta_delivery = await pool.query("SELECT * FROM venta_pedidos");
  res.render('consultar-pedido/consultar-pedido',{venta_delivery})
};

controller.get_checked = async(req,res)=>{
  const { cod_ven } = req.params;
  await pool.query(`UPDATE venta SET estado=0 WHERE cod_ven=${cod_ven}`, (err, resp) => {
      if (err) {
          req.flash('failure', "Hubo un error");
          res.redirect('/consultar-pedido');
      } else {
          req.flash('success', 'Entrega realizada');
          res.redirect('/consultar-pedido');
      }
  });
};

module.exports = controller;