const express = require('express');
const router = express.Router();
const pool = require('../database');
const helpers = require('../lib/helpers');
const stripe = require('stripe')(process.env.SK_STRIPE);


router.get('/carrito', (req, res) => {
    res.render('web/carrito', { layout: 'index' });
})
router.post('/carrito', async(req, res) => {
    let { nombre, cantidad, subtotal, total, nombre_cliente, apellido_cliente, dni, telf, email, distrito, direccion } = req.body;
    subtotal = parseFloat(subtotal.replace('S/.', ""));
    total = parseFloat(total.replace('S/.', ""));
    try {
        const customer = await stripe.customers.create({
            email: email,
            source: req.body.stripeToken
        })
        const charge = await stripe.charges.create({
            amount: String(total * 100),
            currency: 'pen',
            customer: customer.id,
            description: 'Manos Nortenas'
        });
        console.log(customer, charge);
    } catch (e) {
        console.log('error', e);
    }

    let cadena_nombre = ``;
    let array_nombres = [];

    if (typeof(nombre) === "object") {
        nombre.forEach((val, index) => {
            while (cantidad[index] > 1) {
                cadena_nombre += `${val},`;
                cantidad[index]--
            }
            cadena_nombre += `${val},`;
        });
        cadena_nombre = cadena_nombre.substring(0, cadena_nombre.length - 1).split(',')
        array_nombres.push(cadena_nombre);
        console.log('cadena: ', cadena_nombre);
    } else if (typeof(nombre) === "string") {
        for (let i = 0; i < cantidad; i++) {
            cadena_nombre += `${nombre},`
        }
        cadena_nombre = cadena_nombre.substring(0, cadena_nombre.length - 1).split(',')
        array_nombres.push(cadena_nombre);
        console.log('cadena: ', cadena_nombre);
    }
    //*Getting timestamp
    const current_timestamp = await pool.query('SELECT CURRENT_TIMESTAMP');
    const fecha_venta = helpers.formatdatetodb(current_timestamp[0].CURRENT_TIMESTAMP);
    console.log('parsed:', fecha_venta);

    try {
        await pool.query('call insert_online_venta(?,?,?,?,?,?,?,?,?,?)', [fecha_venta, subtotal, total, nombre_cliente, apellido_cliente, dni, telf, email, distrito, direccion]);
    } catch (e) {
        console.log(e)
    }
    const last_cod_ven = await pool.query("SELECT max(cod_ven) FROM venta;");
    try {
        array_nombres[0].forEach(async(val, index) => {
            await pool.query("call insert_carrito_system(?,?)", [last_cod_ven[0]['max(cod_ven)'], val]);
        });
    } catch (e) {
        req.flash('failure', 'Ingrese datos');
        res.redirect('/carrito')
    }
    req.flash('success', 'Pago Satisfactorio, en breve nos comunicaremos a su numero de telefono');

    res.redirect('/carta')
})
module.exports = router