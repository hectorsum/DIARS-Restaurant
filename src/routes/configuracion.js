const pool = require('../database');
const { isnotlogedin } = require('../lib/out');
const express = require('express');
const helpers = require('../lib/helpers');
const router = express.Router();


router.get('/configuracion', isnotlogedin, async(req, res) => {
    const configuracion = await pool.query('SELECT * FROM configuracion');
    res.render('configuracion/configuracion', { configuracion: configuracion[0] });
});

router.post('/configuracion', isnotlogedin, async(req, res) => {
    const { nombre_restaurant, direccion, email, hidden_departamento, hidden_provincia, hidden_distrito, id_departamento, id_provincia, id_distrito } = req.body;
    const config = {
        nombre_restaurant,
        direccion,
        email,
        departamento: hidden_departamento,
        provincia: hidden_provincia,
        distrito: hidden_distrito,
        id_departamento,
        id_provincia,
        id_distrito
    }
    console.log(req.body)
        /* await pool.query('UPDATE configuracion SET ? WHERE cod_config=1',[config],async(err)=>{
          if(err){
            req.flash('failure','No se pudo actualizar')
            res.redirect('/configuracion')
          }else{
            req.flash('success','Datos actualizados')
            res.redirect('/configuracion')
          }
        }) */
});
module.exports = router;