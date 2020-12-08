const express = require('express');
const pool = require('../database');
const helpers = require('../lib/helpers');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');
const pdf = require('../lib/puppeteer');

router.get('/', isnotlogedin, async(req, res) => {

    //*Querying tables
    const venta = await pool.query("SELECT venta.*, tipo_pago.*, tipo_comprobante.nombre_comprobante FROM venta LEFT JOIN tipo_pago ON venta.cod_tipo_pago = tipo_pago.cod_tipo_pago LEFT JOIN tipo_comprobante ON venta.cod_tipo_comprobante = tipo_comprobante.cod_tipo_comprobante WHERE DATE(fecha_venta) LIKE CURDATE() and tipo_venta='local' and estado_pago!='Truncado'");
    const tipo_pago = await pool.query('SELECT * FROM tipo_pago')
    const tipo_comprobante = await pool.query('SELECT * FROM tipo_comprobante')
    const usuario_emp = await pool.query("SELECT `usuario_emp`.`cod_emp`, `empleado`.`nombres`, `empleado`.`apellidos` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp`")
    const comanda = await pool.query("SELECT * FROM venta WHERE estado=1 and tipo_venta!='delivery' ORDER BY cod_ven DESC");
    res.render('generar-cuenta/generar-cuenta', { venta, tipo_pago, usuario_emp, tipo_comprobante, comanda })
})

router.post('/', isnotlogedin, async(req, res) => {
    const { caja, num_mesa, tipo_pago, tipo_comprobante, razon_social, num_ruc, direccion } = req.body;
    const current_timestamp = await pool.query('SELECT CURRENT_TIMESTAMP');
    const fecha_venta = helpers.formatdatetodb(current_timestamp[0].CURRENT_TIMESTAMP);
    await pool.query("call update_venta_local(?,?,?,?,?,?,?,?)", [caja, fecha_venta, tipo_pago, tipo_comprobante, razon_social, num_ruc, direccion, num_mesa], (err, resp) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', "Registrado Satisfactoriamente");
            res.redirect('/generar-cuenta');
        }
    });
});

router.get('/edit/:cod_ven', isnotlogedin, async(req, res) => {
  const {cod_ven} = req.params;
  const venta = await pool.query("SELECT venta.*, tipo_pago.*, tipo_comprobante.nombre_comprobante FROM venta LEFT JOIN tipo_pago ON venta.cod_tipo_pago = tipo_pago.cod_tipo_pago LEFT JOIN tipo_comprobante ON venta.cod_tipo_comprobante = tipo_comprobante.cod_tipo_comprobante WHERE DATE(fecha_venta) LIKE CURDATE() and tipo_venta='local' and cod_ven=?",[cod_ven]);
  console.log(venta[0]);
  res.render('generar-cuenta/edit',{venta:venta[0]});
})

router.post('/edit/:cod_ven', isnotlogedin, async(req, res) => {
  const {cod_ven} = req.params;
  const {estado_pago} = req.body;
  console.log(req.body);
  if (estado_pago === 'Truncado'){
    await pool.query('UPDATE venta SET estado=0 WHERE cod_ven=?',[estado_pago,cod_ven],async(err)=>{
      if(err){
        req.flash('failure', 'No se pudo editar ' + err)
        res.redirect('/generar-cuenta')
      }else{
        req.flash('success', 'Editado Satisfactoriamente')
        res.redirect('/generar-cuenta')
      }
    })
  }else{
    await pool.query('UPDATE venta SET estado_pago=? WHERE cod_ven=?',[estado_pago,cod_ven],async(err)=>{
      if(err){
        req.flash('failure', 'No se pudo editar ' + err)
        res.redirect('/generar-cuenta')
      }else{
        req.flash('success', 'Editado Satisfactoriamente')
        res.redirect('/generar-cuenta')
      }
    })
  }
})

//pdf
router.get('/print/:cod_ven', isnotlogedin, async(req, res) => {
  try {
      const { cod_ven } = req.params;
      var npdf = await pdf.boleta(cod_ven);
      console.log('ERROR HERE: ', npdf)
      res.contentType("application/pdf");
      res.send(npdf);
  } catch (e) {
      console.log(e);
  }
});

module.exports = router;