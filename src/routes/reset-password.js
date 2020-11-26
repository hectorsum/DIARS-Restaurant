const express = require('express');
const router = express.Router();
const pool = require('../database');
const mailgun = require('mailgun-js');
const jwt = require('jsonwebtoken');
const DOMAIN = "";
const nodemailer = require('nodemailer')
const uuid = require('uuid')
require('dotenv').config()

router.get('/reset-password', async(req, res) => {
    res.render('auth/reset-password', { layout: 'index' })
})

router.post('/reset-password', async(req, res) => {
  const { email } = req.body;
  const empleado = await pool.query("SELECT `usuario_emp`.`cod_emp`, `empleado`.`email` FROM `usuario_emp` LEFT JOIN `empleado` ON `usuario_emp`.`cod_emp` = `empleado`.`cod_emp` WHERE `empleado`.`email` = ? ", [email]);
  console.log(empleado);
  if (empleado.length === 0){
    req.flash('success','Se envio un codigo de verificacion al correo electronico')
    res.redirect('/');
  }else{
    const empleado_id = empleado[0].cod_emp
    let url = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    let cod_recuperacion = uuid.v5.URL.substring(0, 13) + empleado_id
    let mail_message = url + cod_recuperacion
    console.log(mail_message)
    await pool.query('UPDATE usuario_emp SET cod_recuperacion=? WHERE cod_emp=?', [cod_recuperacion, empleado_id], (err, resp, fields) => {
        if (err) {
            console.log(err)
            res.redirect('/reset-password');
        } else {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                }
            });
            //Alias 2nd option
            var mailOptions = {
                from: 'ManosNorteñas@gmail.com',
                to: email,
                subject: 'Password Recovery',
                html: 'Ingrese a esta dirección para modificar su contraseña actual<br><br>' + mail_message
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    res.redirect('/');
                } else {
                  console.log('success')
                  req.flash('success','Se envio un codigo de verificacion al correo electronico')
                  res.redirect('/');
                }
            });
        }
    });
  }
})

router.get('/reset-password/:code', async(req, res) => {
    const { code } = req.params
    const check_exist = await pool.query("SELECT * FROM usuario_emp WHERE cod_recuperacion=?", [code]);
    if (check_exist.length > 0) {
        res.render('auth/set-new-password', { layout: 'index', code: code })
    } else {
        res.redirect('/');
    }
})

router.post('/reset-password/:code', async(req, res) => {
    const { code } = req.params
    const { password, confirm_password } = req.body
    await pool.query('UPDATE usuario_emp SET password=?, cod_recuperacion=null WHERE cod_recuperacion=?', [password, code], (err, resp, fields) => {
        if (err) {
            console.log(err)
            res.redirect('/');
        } else {
            res.redirect('/signin');
        }
    });
})

module.exports = router;