const uploadImage = require('../lib/multer');
const pool = require('../database');
const controller = {};

controller.get_segundo = async(req,res)=>{
  const carta = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'segundo' and estado=1");
  res.render('mantener-segundo/mantener-segundo',{carta});
};

controller.get_add_segundo = async(req,res)=>{
  res.render('mantener-segundo/add');
};

controller.post_add_segundo = async(req,res)=>{
  uploadImage(req,res,async(err)=>{
    if(err){
      req.flash('failure','No se pudo agregar Error: '+err);
      res.redirect('/mantener-segundo');
    }else{
      let {nombre,precio,stock,lleva_pollo,descripcion} = req.body;
      const pathname = req.file.filename;
      lleva_pollo = (lleva_pollo) ? 1 : 0;
      console.log(lleva_pollo)
      console.log(req.file.filename);
      await pool.query('call add_mantener(?,?,?,?,?,?,?)',[nombre,precio,'segundo',stock,pathname,lleva_pollo,descripcion],async(err,resp)=>{
        if (err) {
          req.flash('failure', "No se pudo agregar" + err);
          res.redirect('/mantener-segundo');
        }
        else{
          req.flash('success', 'Registrado Satisfactoriamente');
          res.redirect('/mantener-segundo')  
        }
      });
    }
  })
};

controller.get_edit_segundo = async(req,res)=>{
  const {cod_carta} = req.params;
  const carta = await pool.query("SELECT * FROM carta WHERE carta.cod_carta=?",[cod_carta]);
  console.log(carta[0]);
  res.render('mantener-segundo/edit',{carta:carta[0]});
};

controller.post_edit_segundo = async(req,res)=>{
  uploadImage(req, res, async (err) => {
    if (err) {
        req.flash('failure', "No se pudo actualizar, Error:" + err);
        res.redirect('/mantener-segundo');
    }
    else {
      const { cod_carta } = req.params;
      let {nombre,precio,stock,lleva_pollo,descripcion} = req.body;
      lleva_pollo = (lleva_pollo) ? 1 : 0;
      console.log(req.file);
      var new_segundo = {
        nombre,
        precio,
        stock,
        lleva_pollo,
        descripcion
      };
      if (req.file != undefined) {
          const pathname = req.file.filename;
          new_segundo = {
              nombre,
              precio,
              stock,
              lleva_pollo,
              descripcion,
              pathname
          };
      }
      await pool.query('UPDATE carta SET ? WHERE cod_carta=?', [new_segundo, cod_carta], (err, resp, fields) => {
          if (err) {
              req.flash('failure', "No se pudo actualizar" + err);
              res.redirect('/mantener-segundo');
          }
          else {
              req.flash('success', 'Actualizado Satisfactoriamente');
              res.redirect('/mantener-segundo');
          }
      });
    }
  })
};

controller.get_delete_segundo = async(req,res)=>{
  const {cod_carta} = req.params;
  await pool.query(`UPDATE carta SET estado=0 WHERE cod_carta=?`,[cod_carta], (err, resp) => {
    if (err) {
      req.flash('failure', "No se pudo eliminar");
      res.redirect('/mantener-segundo');
    }
    else {
      req.flash('success', 'Eliminado Satisfactoriamente');
      res.redirect('/mantener-segundo');
    }
  });
};

module.exports = controller;