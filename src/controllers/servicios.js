const controller = {};

controller.get_servicio = async(req,res)=>{
  res.render('web/servicios',{layout:'index'})
};

module.exports = controller;