const pool = require('../database');
const {encryptpassword,decryptpassword} = require('../lib/helpers');
const controller = {};

controller.get_usuario = async(req,res)=>{
  const usuario_emp = await pool.query('SELECT * FROM usuarios WHERE estado_cuenta=0')
  res.render('mantener-usuario/mantener-usuario',{usuario_emp});
};

controller.get_add_usuario = async(req,res)=>{
  const empleado = await pool.query('SELECT * FROM empleados WHERE estado_cuenta=1');
  res.render('mantener-usuario/add',{empleado});
};

controller.post_add_usuario = async(req,res)=>{
  const {dni,usuario,password} = req.body;
  const new_password = await encryptpassword(password);
  await pool.query('call insert_user(?,?,?)',[dni,usuario,new_password],async(err,resp,fields)=>{
    if (err) {
      req.flash('failure', "No se pudo agregar" + err);
      res.redirect('/mantener-usuario/add');
    }
    else {
      req.flash('success', 'Registrado Satisfactoriamente');
      res.redirect('/mantener-usuario');
    }
  });
};

controller.get_edit_usuario = async(req,res)=>{
  const {cod_usuario_emp} = req.params;
  const usuario_emp = await pool.query('SELECT * FROM usuarios WHERE cod_usuario_emp=?',[cod_usuario_emp]);
  res.render('mantener-usuario/edit',{usuario_emp:usuario_emp[0]});
};

controller.post_edit_usuario = async(req,res)=>{
  const {cod_usuario_emp} = req.params;
  const {usuario,password} = req.body;
  const data = {
    usuario,
    password
  }
  await pool.query('UPDATE usuario_emp SET ? WHERE cod_usuario_emp=?',[data,cod_usuario_emp],async(err)=>{
    if (err){
      req.flash('failure','No se pudo modificar');
      res.redirect(`/mantener-usuario/edit/${cod_usuario_emp}`);
    }else{
      req.flash('success','Modificado Satisfactoriamente');
      res.redirect('/mantener-usuario');
    }
  })
};

controller.get_delete_usuario = async(req,res)=>{
  const {cod_usuario_emp} = req.params;
  await pool.query('call delete_user(?)',cod_usuario_emp, (err, resp, fields) => {
    if (err) {
      req.flash('failure', "No se pudo eliminar");
      res.redirect('/mantener-usuario');
    }
    else {
      req.flash('success', 'Eliminado Satisfactoriamente');
      res.redirect('/mantener-usuario');
    }
  });
};

module.exports = controller;