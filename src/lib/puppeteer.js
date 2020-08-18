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
  const tipo_pago = await pool.query('SELECT `venta`.`cod_ven`, `tipo_pago`.`nombre` FROM `venta` LEFT JOIN `tipo_pago` ON `venta`.`cod_tipo_pago` = `tipo_pago`.`cod_tipo_pago` WHERE `venta`.`cod_ven`=?',[bid]);
  const segundo = await pool.query('SELECT `venta`.`cod_ven`, `segundo`.* FROM `venta` LEFT JOIN `segundo` ON `venta`.`cod_segundo` = `segundo`.`cod_segundo` WHERE `venta`.`cod_ven`=?',[bid]);
  const producto = await pool.query('SELECT `venta`.`cod_ven`, `producto`.* FROM `venta` LEFT JOIN `producto` ON `venta`.`cod_prod` = `producto`.`cod_prod` WHERE `venta`.`cod_ven`=?',[bid]);
  const entrada = await pool.query('SELECT `venta`.`cod_ven`, `entrada`.* FROM `venta` LEFT JOIN `entrada` ON `venta`.`cod_entrada` = `entrada`.`cod_entrada` WHERE `venta`.`cod_ven`=?',[bid]);


  entrada[0].precio = helpers.money(entrada[0].precio);
  segundo[0].precio = helpers.money(segundo[0].precio);
  producto[0].precio = helpers.money(producto[0].precio);
  venta[0].monto_total = helpers.money(venta[0].monto_total);
  venta[0].valor = helpers.money(venta[0].valor);
  venta[0].fecha_venta = helpers.formatdaytime(venta[0].fecha_venta);
  const template = temp({venta:venta[0],tipo_pago:tipo_pago[0],segundo:segundo[0],producto:producto[0],entrada:entrada[0]});
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