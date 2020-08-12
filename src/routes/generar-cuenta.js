const express = require('express');
const pool = require('../database');
const helpers = require('../lib/helpers');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/',isnotlogedin,async(req,res)=>{
  
  //*Querying tables
  const venta = await pool.query("SELECT `venta`.*, `tipo_pago`.`nombre` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` ORDER BY `venta`.`cod_ven` DESC")
  const entrada = await pool.query('SELECT * FROM entrada')
  const segundo = await pool.query('SELECT * FROM segundo')
  const producto = await pool.query('SELECT * FROM producto')
  const empleado = await pool.query('SELECT nombres,apellidos FROM empleado WHERE cod_rol=2')
  const tipo_pago = await pool.query('SELECT * FROM tipo_pago')
  const usuario_emp = await pool.query("SELECT `usuario_emp`.`cod_emp`, `empleado`.`nombres`, `empleado`.`apellidos` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp`")
  res.render('generar-cuenta/generar-cuenta',{venta,entrada,segundo,producto,empleado,tipo_pago,usuario_emp})
})

router.post('/', async(req,res)=>{
  const {nombre_segundo,nombre_entrada,nombre_producto,cod_tipo_pago,cant_entrada,cant_segundo,cant_producto} = req.body;

  const nombre_producto_string = await pool.query(`SELECT nombre_producto FROM producto WHERE cod_prod=?`,[nombre_producto])
  const nombre_entrada_string = await pool.query(`SELECT nombre_entrada FROM entrada WHERE cod_entrada=?`,[nombre_entrada])
  const nombre_segundo_string = await pool.query(`SELECT nombre_segundo FROM segundo WHERE cod_segundo=?`,[nombre_segundo])
  const nombre_producto_extracted = nombre_producto_string[0].nombre_producto;
  const nombre_entrada_extracted = nombre_entrada_string[0].nombre_entrada
  const nombre_segundo_extracted = nombre_segundo_string[0].nombre_segundo
  
  //*Getting timestamp
  const current_timestamp = await pool.query('SELECT CURRENT_TIMESTAMP');
  const fecha_venta = current_timestamp[0].CURRENT_TIMESTAMP

  //*Getting prices
  const entrada_precio = await pool.query(`SELECT precio FROM entrada WHERE nombre_entrada=?`,[nombre_entrada_extracted]);
  const segundo_precio = await pool.query(`SELECT precio FROM segundo WHERE nombre_segundo=?`,[nombre_segundo_extracted]);
  const producto_precio = await pool.query(`SELECT precio FROM producto WHERE nombre_producto=?`,[nombre_producto_extracted]);
  console.log(entrada_precio)
  console.log(segundo_precio)
  console.log(producto_precio)
  const valor = (cant_entrada*entrada_precio[0].precio)+(cant_segundo*segundo_precio[0].precio)+
  (cant_producto*producto_precio[0].precio);
  const igv = 0.18;
  const descuento = valor*igv;
  const monto_total = valor-descuento;
  await pool.query('call insert_venta_local(?,?,?,?,?,?,?,?,?,?)',[nombre_segundo_extracted,nombre_entrada_extracted,nombre_producto_extracted,valor,monto_total,fecha_venta,cant_entrada,cant_segundo,cant_producto,cod_tipo_pago],async(err,resp,fields)=>{
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

router.get('/edit/:cod_ven',async(req,res)=>{
  const {cod_ven} = req.params;
  const venta = pool.query('SELECT * FROM venta WHERE cod_ven=?',[cod_ven])
  res.render('generar-cuenta/edit',venta)
})
router.post('/edit/:cod_ven',async(req,res)=>{
  
})


module.exports = router;