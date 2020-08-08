const express = require('express');
const pool = require('../database');
const helpers = require('../lib/helpers');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/generar-cuenta',isnotlogedin,async(req,res)=>{
  const venta = await pool.query("SELECT `venta`.*, `tipo_pago`.`nombre` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago`")
  const entrada = await pool.query('SELECT * FROM entrada')
  const segundo = await pool.query('SELECT * FROM segundo')
  const producto = await pool.query('SELECT * FROM producto')
  const empleado = await pool.query('SELECT nombres,apellidos FROM empleado WHERE cod_rol=2')
  const tipo_pago = await pool.query('SELECT * FROM tipo_pago')
  res.render('generar-cuenta/generar-cuenta',{venta,entrada,segundo,producto,empleado,tipo_pago})
})

router.post('/generar-cuenta', async(req,res)=>{
  const {nombre_segundo,nombre_entrada,nombre_producto,cod_tipo_pago,cant_entrada,cant_segundo,cant_producto} = req.body;

  console.log(nombre_segundo)
  //*Getting timestamp
  const current_timestamp = await pool.query('SELECT CURRENT_TIMESTAMP');
  console.log(current_timestamp)
  const fecha_venta = current_timestamp[0].CURRENT_TIMESTAMP

  const estado_pago = (cod_tipo_pago===2) ? 'Cancelado':'Pendiente';
  console.log('estado: ',estado_pago)
  //*Getting prices
  const entrada_precio = await pool.query(`SELECT precio FROM entrada WHERE cod_entrada LIKE '${nombre_entrada}'`)
  console.log(entrada_precio)
  const segundo_precio = await pool.query(`SELECT precio FROM segundo WHERE cod_segundo LIKE '${nombre_segundo}'`)
  console.log(segundo_precio)
  const producto_precio = await pool.query(`SELECT precio FROM producto WHERE cod_prod LIKE '${nombre_producto}'`)
  console.log(producto_precio)

  const valor = (cant_entrada*entrada_precio[0].precio)+(cant_segundo*segundo_precio[0].precio)+
  (cant_producto*producto_precio[0].precio);
  const igv = 0.18;
  const descuento = valor*igv;
  const monto_total = valor-descuento;

  await pool.query('call insert_venta_local(?,?,?,?,?,?,?,?,?,?)',[nombre_segundo,nombre_entrada,nombre_producto,valor,monto_total,fecha_venta,cant_entrada,cant_segundo,cant_producto,cod_tipo_pago],async(err,resp,fields)=>{
    if (err) {
      console.log(err)
      req.flash('failure', "Couldn't register" + err);
      res.redirect('/generar-cuenta');
    }
    else {
        req.flash('success', 'Successfully registered');
        console.log('finished inserting')
        res.redirect('/generar-cuenta');
    }
  });
});

module.exports = router;