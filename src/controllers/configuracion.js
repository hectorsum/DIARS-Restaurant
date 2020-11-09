const uploadImage = require('../lib/multer');
const pool = require('../database');
const controller = {}

controller.get_configuracion = async(req,res)=>{
  const configuracion = await pool.query('SELECT * FROM configuracion');
  console.log(configuracion)
  res.render('configuracion/configuracion',{configuracion:configuracion[0]});
}
controller.post_configuracion = async(req,res)=>{
  uploadImage(req,res,async(err)=>{
    if(err){
      req.flash('failure','No se pudo agregar Error: '+err);
      res.redirect('/mantener-producto');
    }else{
      const { nombre_restaurant,direccion,email,hidden_departamento,hidden_provincia,hidden_distrito,id_departamento,id_provincia,id_distrito,igv } = req.body;
      console.log(req.file)
      var config = {
        nombre_restaurant,
        direccion,
        email,
        departamento:hidden_departamento,
        provincia:hidden_provincia,
        distrito:hidden_distrito,
        id_departamento,
        id_provincia,
        id_distrito,
        igv
      }
      if (req.file != undefined) {
        const pathname = req.file.filename;
        config = {
          nombre_restaurant,
          direccion,
          email,
          departamento:hidden_departamento,
          provincia:hidden_provincia,
          distrito:hidden_distrito,
          id_departamento,
          id_provincia,
          id_distrito,
          igv,
          pathname
        }
      }
      await pool.query('UPDATE configuracion SET ? WHERE cod_config=1',[config],async(err)=>{
        if(err){
          req.flash('failure','No se pudo actualizar')
          res.redirect('/configuracion')
        }else{
          req.flash('success','Datos actualizados')
          res.redirect('/configuracion')
        }
      })
    }
  })
}

module.exports = controller;