const controller = {};
const pool = require('../database');

controller.get_venta = async(req,res)=>{
  const venta = await pool.query("SELECT * FROM venta_restaurante");
  const venta_delivery = await pool.query("SELECT * FROM venta_delivery");
  res.render('consultar-venta/consultar-venta',{venta,venta_delivery});
};

controller.get_pdf = async(req,res)=>{
  try {
    const { cod_ven } = req.params;
    var npdf = await pdf.boleta(cod_ven);
    console.log('ERROR HERE: ', npdf)
    res.contentType("application/pdf");
    res.send(npdf);
  } catch (e) {
      console.log(e);
  }
};

module.exports = controller;