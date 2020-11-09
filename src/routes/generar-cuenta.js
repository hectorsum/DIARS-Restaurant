const express = require('express');
const pool = require('../database');
const helpers = require('../lib/helpers');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');
const pdf = require('../lib/puppeteer');

router.get('/', isnotlogedin, async(req, res) => {

    //*Querying tables
    const venta = await pool.query("SELECT venta.*, tipo_pago.*, tipo_comprobante.nombre_comprobante FROM venta LEFT JOIN tipo_pago ON venta.cod_tipo_pago = tipo_pago.cod_tipo_pago LEFT JOIN tipo_comprobante ON venta.cod_tipo_comprobante = tipo_comprobante.cod_tipo_comprobante WHERE DATE(fecha_venta) LIKE CURDATE() and estado_pago='cancelado'");
    /* const entrada = await pool.query('SELECT * FROM entrada') */
    /* const segundo = await pool.query('SELECT * FROM segundo') */
    /* const producto = await pool.query('SELECT * FROM producto') */
    const tipo_pago = await pool.query('SELECT * FROM tipo_pago')
    const tipo_comprobante = await pool.query('SELECT * FROM tipo_comprobante')
    const usuario_emp = await pool.query("SELECT `usuario_emp`.`cod_emp`, `empleado`.`nombres`, `empleado`.`apellidos` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp`")
    const comanda = await pool.query("SELECT * FROM venta WHERE estado=1 ORDER BY cod_ven DESC");
    res.render('generar-cuenta/generar-cuenta', { venta, tipo_pago, usuario_emp, tipo_comprobante, comanda })
})

router.post('/', isnotlogedin, async(req, res) => {
    console.log(req.body);
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

})

router.post('/edit/:cod_ven', isnotlogedin, async(req, res) => {

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