const controller = {};

controller.get_contacto = async(req,res)=>{
  res.render('web/contacto',{layout:'index'})
};

module.exports = controller;