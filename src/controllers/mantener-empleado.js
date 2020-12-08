const controller = {};
const gravatar = require('gravatar');
const pool = require('../database');
const uploadImage = require('../lib/multer');

controller.get_empleado = async(req,res)=>{
  const empleado = await pool.query('SELECT * FROM empleados WHERE estado_cuenta!=3');
  for (i = 0; i < empleado.length; i++) {
      if (!empleado[i].photo) {
          const url = gravatar.url(empleado[i].email, { s: '100', r: 'x', d: 'mp' }, false);
          empleado[i].photo = url
      } else {
          empleado[i].photo = 'uploads/' + empleado[i].photo
      }
  }
  res.render('mantener-empleado/mantener-empleado', { empleado });
};

controller.get_add_empleado = async(req,res)=>{
  const rol = await pool.query('SELECT * FROM rol');
  res.render('mantener-empleado/add', { rol });
};

controller.post_add_empleado = async(req,res)=>{
  const { nombres, apellidos, dni, telefono, email, cod_rol,descripcion} = req.body;
  await pool.query('INSERT INTO empleado(nombres,apellidos,dni,telefono,email,cod_rol,descripcion) VALUES (?,?,?,?,?,?,?)', [nombres, apellidos, dni, telefono, email, cod_rol,descripcion], async(err, resp, fields) => {
      if (err) {
          req.flash('failure', "No se pudo agregar el empleado" + err);
          res.redirect('/mantener-empleado');
      } else {
          req.flash('success', 'Registrado Satisfactoriamente');
          res.redirect('/mantener-empleado');
      }
  });
};

controller.get_edit_empleado = async(req,res)=>{
  const { cod_emp } = req.params;
  const empleado = await pool.query('SELECT * FROM empleados WHERE cod_emp=?', [cod_emp]);

  if (!empleado[0].photo) {
      const url = gravatar.url(empleado[0].email, { s: '100', r: 'x', d: 'mp' }, false);
      empleado[0].photo = url
  } else {
      empleado[0].photo = '/uploads/' + empleado[0].photo
  }
  const rol = await pool.query('SELECT * FROM rol');
  res.render('mantener-empleado/edit', { empleado: empleado[0], rol });
};

controller.post_edit_empleado = async(req,res)=>{
  uploadImage(req, res, async(err) => {
    if (err) {
        req.flash('failure', 'No se pudo agregar Error: ' + err);
        res.redirect('/mantener-empleado');
    } else {
      const { cod_emp } = req.params;
      const { nombres, apellidos, dni, telefono, email, cod_rol, descripcion} = req.body;
      empleado = {
          nombres,
          apellidos,
          dni,
          telefono,
          email,
          cod_rol,
          descripcion
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
              photo,
              descripcion
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
};

controller.get_delete_empleado = async(req,res)=>{
  const { cod_emp } = req.params;
  const has_account = await pool.query('SELECT estado_cuenta FROM empleados WHERE cod_emp=?',[cod_emp])
  if (has_account===0){ //* 0 == has account, 1 == don't have account, 3 == deleted
    let result = confirm('Este empleado tiene un usuario creado, ¿Esta seguro que desea eliminarlo?')
    if(result){
      await pool.query(`call delete_empleado(?)`,cod_emp, (err, resp, fields) => {
        if (err) {
          req.flash('failure', "No se pudo eliminar");
          res.redirect('/mantener-empleado');
        } else {
          req.flash('success', 'Eliminado Satisfactoriamente');
          res.redirect('/mantener-empleado');
        }
      });
    }
  }else{
    await pool.query('UPDATE empleado SET estado_cuenta=3 WHERE cod_emp=?',[cod_emp],(err)=>{
      if (err) {
        req.flash('failure', "No se pudo eliminar");
        res.redirect('/mantener-empleado');
      } else {
        req.flash('success', 'Eliminado Satisfactoriamente');
        res.redirect('/mantener-empleado');
      }
    })
  }
};

module.exports = controller;