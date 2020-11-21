const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pool = require('../database');
const helpers = require('../lib/helpers');
const pdf = {};

pdf.boleta = async(bid) =>{
  var content = await fs.readFileSync(path.join(__dirname,'../views/generar-cuenta/boleta.hbs'),'utf-8');
  const temp = await handlebars.compile(content);
  const venta = await pool.query('SELECT * FROM venta WHERE cod_ven=?',[bid])  
  const tipo_pago = await pool.query('SELECT `venta`.`cod_ven`, `tipo_pago`.`nombre_tipo_pago` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` WHERE `venta`.`cod_ven`=?',[bid]);
  const carta = await pool.query("SELECT `venta`.`cod_ven`,`venta`.`num_mesa`,`venta`.`fecha_venta`, `carta`.`nombre`,COUNT(`detalle_carta`.`cod_carta`) AS cantidad, `carta`.`categoria`,`carta`.`pathname`,carta.precio*COUNT(`detalle_carta`.`cod_carta`) as total FROM `venta` LEFT JOIN `detalle_carta` ON `detalle_carta`.`cod_ven` = `venta`.`cod_ven` LEFT JOIN `carta` ON `detalle_carta`.`cod_carta` = `carta`.`cod_carta` WHERE `venta`.`cod_ven`=? GROUP BY `carta`.`nombre`",[bid]);

  console.log(carta);
  
  carta[0].precio = helpers.money(carta[0].precio);
  venta[0].total = helpers.money(venta[0].total);
  venta[0].subtotal = helpers.money(venta[0].subtotal);
  venta[0].fecha_venta = helpers.formatdaytime(venta[0].fecha_venta);
  //console.log(carta[0]);
  const template = temp({venta:venta[0],tipo_pago:tipo_pago[0],carta});
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.setContent(template,{
    waitUntil:'domcontentloaded'
  });
  const pdf = await page.pdf({
    format:'A4',
    printBackground:true,
    margin:15
  });
  return pdf;
};

module.exports = pdf;