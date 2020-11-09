const pool = require('../database');
const express = require('express');
const path = require('path');
const router = express.Router();
const gravatar = require('gravatar');
const uploadImage = require('../lib/multer');
const { isnotlogedin, islogedin } = require('../lib/out');

router.get('/', isnotlogedin, async(req, res) => {
    const empleado = await pool.query('SELECT `empleado`.*, `rol`.`rol_nombre`, `rol`.`rol_nombre` FROM `empleado` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol`');
    for (i = 0; i < empleado.length; i++) {
        if (!empleado[i].photo) {
            const url = gravatar.url(empleado[i].email, { s: '100', r: 'x', d: 'mp' }, false);
            empleado[i].photo = url
        } else {
            empleado[i].photo = 'uploads/' + empleado[i].photo
        }
    }

    res.render('mantener-empleado/mantener-empleado', { empleado });
});

router.get('/add', isnotlogedin, async(req, res) => {
    const rol = await pool.query('SELECT * FROM rol');
    res.render('mantener-empleado/add', { rol });
})

router.post('/add', isnotlogedin, async(req, res) => {
    const { nombres, apellidos, dni, telefono, email, cod_rol } = req.body;
    await pool.query('INSERT INTO EMPLEADO(nombres,apellidos,dni,telefono,email,cod_rol) VALUES (?,?,?,?,?,?)', [nombres, apellidos, dni, telefono, email, cod_rol], async(err, resp, fields) => {
        if (err) {
            req.flash('failure', "No se pudo agregar el empleado" + err);
            res.redirect('/mantener-empleado');
        } else {
            req.flash('success', 'Registrado Satisfactoriamente');
            res.redirect('/mantener-empleado');
        }
    });
});

router.get('/edit/:cod_emp', isnotlogedin, async(req, res) => {
    const { cod_emp } = req.params;
    const empleado = await pool.query('SELECT `empleado`.*, `rol`.`rol_nombre`, `rol`.`rol_nombre` FROM `empleado` LEFT JOIN `rol` ON `empleado`.`cod_rol` = `rol`.`cod_rol` WHERE cod_emp=?', [cod_emp]);

    if (!empleado[0].photo) {
        const url = gravatar.url(empleado[0].email, { s: '100', r: 'x', d: 'mp' }, false);
        empleado[0].photo = url
    } else {
        empleado[0].photo = '/uploads/' + empleado[0].photo
    }
    const rol = await pool.query('SELECT * FROM rol');
    res.render('mantener-empleado/edit', { empleado: empleado[0], rol });
})

router.post('/edit/:cod_emp', async(req, res) => {
    uploadImage(req, res, async(err) => {
            if (err) {
                req.flash('failure', 'No se pudo agregar Error: ' + err);
                res.redirect('/mantener-empleado');
            } else {
                const { cod_emp } = req.params;
                const { nombres, apellidos, dni, telefono, email, cod_rol } = req.body;
                empleado = {
                    nombres,
                    apellidos,
                    dni,
                    telefono,
                    email,
                    cod_rol,
                }
                if (req.file != undefined) {
                    const photo = req.file.filename;
                    empleado = {
                        nombres,
                        apellidos,
                        dni,
                        telefono,
                        email,
                        cod_rol,
                        photo
                    }
                }
                await pool.query('UPDATE empleado SET ? WHERE cod_emp=?', [empleado, cod_emp], async(err) => {
                    if (err) {
                        req.flash('failure', 'No se pudo actualizar ' + err)
                        res.redirect('/mantener-empleado')
                    } else {
                        req.flash('success', 'Datos actualizados')
                        res.redirect('/mantener-empleado')
                    }
                })
            }
        })
        /* const { cod_emp } = req.params;
        const { nombres, apellidos, dni, telefono, email, cod_rol } = req.body;
        empleado = {
            nombres,
            apellidos,
            dni,
            telefono,
            email,
            cod_rol
        }
        await pool.query('UPDATE empleado SET ? WHERE cod_emp=?', [empleado, cod_emp], async(err, resp, fields) => {
            if (err) {
                req.flash('failure', "No se pudo agregar el producto" + err);
                res.redirect('/mantener-empleado');
                console.log(err)
            } else {
                req.flash('success', 'Modificado Satisfactoriamente');
                res.redirect('/mantener-empleado');
            }
        }); */
})

router.get('/delete/:cod_emp', isnotlogedin, async(req, res) => {
    const { cod_emp } = req.params;
    await pool.query(`DELETE FROM empleado WHERE cod_emp=${cod_emp}`, (err, resp, fields) => {
        if (err) {
            req.flash('failure', "No se pudo eliminar");
            res.redirect('/mantener-empleado');
        } else {
            req.flash('success', 'Eliminado Satisfactoriamente');
            res.redirect('/mantener-empleado');
        }
    });
})

module.exports = router;