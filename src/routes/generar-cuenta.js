const express = require('express');
const pool = require('../database');
const helpers = require('../lib/helpers');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
const pdf = require('../lib/puppeteer');


/*
input > num_mesa 
input > cajero
input > fecha
btn > elegir comanda
input > subtotal, total
cbo > seleccionar tipo pago
cbo > tipo_comprobante
input > razon social, direccion, num ruc
*/

router.get('/',isnotlogedin,async(req,res)=>{
  
  //*Querying tables
  const venta = await pool.query("SELECT `venta`.*, `tipo_pago`.`nombre` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` ORDER BY `venta`.`cod_ven` DESC")
  const entrada = await pool.query('SELECT * FROM entrada')
  const segundo = await pool.query('SELECT * FROM segundo')
  const producto = await pool.query('SELECT * FROM producto')
  const tipo_pago = await pool.query('SELECT * FROM tipo_pago')
  const tipo_comprobante = await pool.query('SELECT * FROM tipo_comprobante')
  const usuario_emp = await pool.query("SELECT `usuario_emp`.`cod_emp`, `empleado`.`nombres`, `empleado`.`apellidos` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp`")
  res.render('generar-cuenta/generar-cuenta',{venta,entrada,segundo,producto,tipo_pago,usuario_emp,tipo_comprobante})
})

router.post('/', isnotlogedin,async(req,res)=>{
  const {nombre_segundo,nombre_entrada,nombre_producto,cod_tipo_pago,cant_entrada,cant_segundo,cant_producto,caja} = req.body;

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
  const valor = (cant_entrada*entrada_precio[0].precio)+(cant_segundo*segundo_precio[0].precio)+
  (cant_producto*producto_precio[0].precio);
  const igv = 0.18;
  const descuento = valor*igv;
  const monto_total = valor-descuento;
  await pool.query('call insert_venta_local(?,?,?,?,?,?,?,?,?,?,?)',[nombre_segundo_extracted,nombre_entrada_extracted,nombre_producto_extracted,valor,monto_total,fecha_venta,cant_entrada,cant_segundo,cant_producto,cod_tipo_pago[0],caja],async(err,resp,fields)=>{
    if (err) {
      req.flash('failure', "No se pudo registrar la cuenta" + err);
      res.redirect('/generar-cuenta');
    }
    else {
        req.flash('success', 'Registrado Satisfactoriamente');
        console.log('finished inserting')
        res.redirect('/generar-cuenta');
    }
  });
});

router.get('/edit/:cod_ven',isnotlogedin,async(req,res)=>{
  //*Getting data from Venta
  const {cod_ven} = req.params;
  const venta = await pool.query('SELECT * FROM venta WHERE cod_ven=?',[cod_ven])

  //*Getting other data
  const entrada = await pool.query('SELECT * FROM entrada')
  const segundo = await pool.query('SELECT * FROM segundo')
  const producto = await pool.query('SELECT * FROM producto')
  const tipo_pago = await pool.query('SELECT * FROM tipo_pago')
  res.render('generar-cuenta/edit',{venta:venta[0],tipo_pago,entrada,segundo,producto})
})
router.post('/edit/:cod_ven',isnotlogedin,async(req,res)=>{
  const {cod_ven} = req.params;
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
  const valor = (cant_entrada*entrada_precio[0].precio)+(cant_segundo*segundo_precio[0].precio)+
  (cant_producto*producto_precio[0].precio);
  const igv = 0.18;
  const descuento = valor*igv;
  const monto_total = valor-descuento;

  let estado_pago;
  if (cod_tipo_pago===`2`){
    estado_pago = 'Cancelado';
  }
  else{
    estado_pago = 'Pendiente';
  }

  const cod_prod=await pool.query('SELECT cod_prod from producto WHERE `producto`.`nombre_producto`=?',[nombre_producto_extracted]);
  const cod_entrada=await pool.query('SELECT cod_entrada from entrada WHERE `entrada`.`nombre_entrada`=?',[nombre_entrada_extracted]);
  const cod_segundo=await pool.query('SELECT cod_segundo from segundo WHERE `segundo`.`nombre_segundo`=?',[nombre_segundo_extracted]);
  var newVenta = {
    cod_tipo_pago,
    estado_pago,
    valor,
    monto_total,
    fecha_venta,
    cant_entrada,
    cant_segundo,
    cant_producto,
    cod_prod:cod_prod[0].cod_prod,
    cod_entrada:cod_entrada[0].cod_entrada,
    cod_segundo:cod_segundo[0].cod_segundo
  }
  console.log(newVenta);
  await pool.query('UPDATE venta SET ? WHERE cod_ven=?',[newVenta,cod_ven],(err, resp, fields) => {
    if (err) {
        req.flash('failure', "No se pudo actualizar la venta" + err);
        res.redirect('/generar-cuenta');
    }
    else {
        req.flash('success', 'Venta Actualizada');
        res.redirect('/generar-cuenta');
    }
  });
})

//pdf
router.get('/print/:cod_ven', isnotlogedin, async (req, res) => {
  try{
    const { cod_ven } = req.params;
    var npdf = await pdf.boleta(cod_ven);
    console.log('ERROR HERE: ',npdf)
    res.contentType("application/pdf");
    res.send(npdf);
  }catch(e){
    console.log(e);
  }
  
});

module.exports = router;