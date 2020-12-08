const controller = {};

controller.get_nosotros = async(req,res)=>{
  res.render('web/nosotros',{layout:'index'})
};

module.exports = controller;