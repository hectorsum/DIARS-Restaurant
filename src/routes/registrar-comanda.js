const express = require('express');
const pool = require('../database');
const router = express.Router();
const {isnotlogedin} = require('../lib/out');
const helpers = require('../lib/helpers');
router.get('/',isnotlogedin,async(req,res)=>{
  //*Querying tables
  const entrada = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'entrada' and estado=1");
  const segundo = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'segundo' and estado=1");
  const producto = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'producto' and estado=1");
  const comanda = await pool.query("SELECT * FROM venta WHERE estado=1 ORDER BY cod_ven DESC");
  res.render('registrar-comanda/registrar-comanda',{entrada,segundo,producto,comanda});
})

router.post('/',isnotlogedin,async(req,res)=>{
  let {num_mesa,nombre,cantidad} = req.body;
  let cadena_nombre = ``;
  let array_nombres = [];

  console.log('type: ',typeof(nombre))

  //todo: getting all repeated products
  if (typeof(nombre)==="object"){
      nombre.forEach((val,index)=>{
        while(cantidad[index]>1){
          cadena_nombre += `${val},`;
          cantidad[index]--
        }
        cadena_nombre+=`${val},`;
      });
      cadena_nombre = cadena_nombre.substring(0,cadena_nombre.length-1).split(',')
      array_nombres.push(cadena_nombre);
      console.log('cadena: ',cadena_nombre);
  }else if (typeof(nombre)==="string"){
    for(let i=0;i<cantidad;i++){
      cadena_nombre+= `${nombre},`
    }
    cadena_nombre = cadena_nombre.substring(0,cadena_nombre.length-1).split(',')
    array_nombres.push(cadena_nombre);
    console.log('cadena: ',cadena_nombre);
  }

  // //*Getting timestamp
  const current_timestamp = await pool.query('SELECT CURRENT_TIMESTAMP');
  const fecha_venta = helpers.formatdatetodb(current_timestamp[0].CURRENT_TIMESTAMP);
  console.log('parsed:',fecha_venta);
  const igv = await pool.query("SELECT igv FROM configuracion");
  var subtotal = 0;
  var total = 0;
  try{
    for (let i = 0; i < array_nombres[0].length; i++) {
      console.log(array_nombres[0][i])
      const price = await pool.query("SELECT precio FROM carta WHERE nombre=?",[array_nombres[0][i]]);
      subtotal += price[0].precio;
    }
    total = subtotal - (subtotal*igv[0].igv);
  }catch(e){
    req.flash('failure', 'Ingrese datos');
    res.redirect('/registrar-comanda')
  }
  
  //* Inserting data (validate if exists or not num_mesa state=1)
  try{
    console.log(subtotal,total)
    await pool.query("call validate_num_mesa_insertion(?,?,?,?)",[num_mesa,fecha_venta,subtotal,total]);
  }catch(e){
    req.flash('failure', 'Elija una mesa diferente');
    res.redirect('/registrar-comanda')
  }
  const last_cod_ven = await pool.query("SELECT max(cod_ven) FROM venta;");
  try{
    array_nombres[0].forEach(async(val,index)=>{
      await pool.query("call insert_carrito_system(?,?)",[last_cod_ven[0]['max(cod_ven)'],val]);
    });
  }catch(e){
    req.flash('failure', 'Ingrese datos');
    res.redirect('/registrar-comanda')
  }
  req.flash('success', 'Registrado Satisfactoriamente');
  res.redirect('/registrar-comanda')
})

router.get('/edit/:cod_ven',isnotlogedin,async(req,res)=>{
  const {cod_ven} = req.params;
  //* To fill dropdowns
  const entrada = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'entrada' and estado=1");
  const segundo = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'segundo' and estado=1");
  const producto = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'producto' and estado=1");
  //* To fill 
  const comanda = await pool.query("SELECT `venta`.`cod_ven`,`venta`.`num_mesa`,`venta`.`fecha_venta`, `carta`.`nombre`,COUNT(`detalle_carta`.`cod_carta`) AS cantidad, `carta`.`categoria`,`carta`.`pathname` FROM `venta` LEFT JOIN `detalle_carta` ON `detalle_carta`.`cod_ven` = `venta`.`cod_ven` LEFT JOIN `carta` ON `detalle_carta`.`cod_carta` = `carta`.`cod_carta` WHERE `venta`.`cod_ven`=? GROUP BY `carta`.`nombre`",[cod_ven]);
  const venta = await pool.query("SELECT cod_ven,num_mesa FROM venta WHERE cod_ven=?",[cod_ven])
  res.render('registrar-comanda/edit',{entrada,segundo,producto,comanda,venta:venta[0]});
});

router.post('/edit/:cod_ven',async(req,res)=>{
  const {cod_ven} = req.params;
  let {num_mesa,nombre,cantidad} = req.body;
  let cadena_nombre = ``;
  let array_nombres = [];

  await pool.query('DELETE FROM detalle_carta WHERE cod_ven=?',[cod_ven]);

  console.log(req.body);
  if (typeof(nombre)==="object"){
      nombre.forEach((val,index)=>{
        while(cantidad[index]>1){
          cadena_nombre += `${val},`;
          cantidad[index]--
        }
        cadena_nombre+=`${val},`;
      });
      cadena_nombre = cadena_nombre.substring(0,cadena_nombre.length-1).split(',')
      array_nombres.push(cadena_nombre);
      console.log('cadena: ',cadena_nombre);
  }else if (typeof(nombre)==="string"){
    for(let i=0;i<cantidad;i++){
      cadena_nombre+= `${nombre},`
    }
    cadena_nombre = cadena_nombre.substring(0,cadena_nombre.length-1).split(',')
    array_nombres.push(cadena_nombre);
    console.log('cadena: ',cadena_nombre);
  }

  const igv = await pool.query("SELECT igv FROM configuracion");
  var subtotal = 0;
  var total = 0;
  for (let i = 0; i < array_nombres[0].length; i++) {
    console.log(array_nombres[0][i])
    const price = await pool.query("SELECT precio FROM carta WHERE nombre=?",[array_nombres[0][i]]);
    subtotal += price[0].precio;
  }
  total = subtotal - (subtotal*igv[0].igv);

  await pool.query("UPDATE venta SET subtotal=?,total=? WHERE cod_ven=?",[subtotal,total,cod_ven]);

  //* Inserting data
  array_nombres[0].forEach(async(val,index)=>{
    await pool.query("call insert_carrito_system(?,?)",[cod_ven,val]);
  });
  req.flash('success', 'Modificado Satisfactoriamente');
  res.redirect('/registrar-comanda')
});

router.get('/view/:cod_ven',isnotlogedin,async(req,res)=>{
  const {cod_ven} = req.params;
  const comanda = await pool.query("SELECT `venta`.`cod_ven`,`venta`.`num_mesa`,`venta`.`fecha_venta`, `carta`.`nombre`,COUNT(`detalle_carta`.`cod_carta`) AS cantidad, `carta`.`categoria`,`carta`.`pathname` FROM `venta` LEFT JOIN `detalle_carta` ON `detalle_carta`.`cod_ven` = `venta`.`cod_ven` LEFT JOIN `carta` ON `detalle_carta`.`cod_carta` = `carta`.`cod_carta` WHERE `venta`.`cod_ven`=? GROUP BY `carta`.`nombre`",[cod_ven]);
  const venta = await pool.query("SELECT num_mesa,fecha_venta FROM venta WHERE cod_ven=?",[cod_ven])
  res.render('registrar-comanda/view',{comanda,venta:venta[0]});
})

router.get('/delete/:cod_ven',isnotlogedin,async(req,res)=>{
  const {cod_ven} = req.params;
  await pool.query("UPDATE venta SET estado=0 WHERE cod_ven=?",[cod_ven],(err,resp)=>{
    if (err){
      req.flash('failure', "No se pudo eliminar");
      res.redirect('/registrar-comanda');
    }else {
      req.flash('success', 'Eliminado Satisfactoriamente');
      res.redirect('/registrar-comanda');
    }
  });
});

module.exports = router;