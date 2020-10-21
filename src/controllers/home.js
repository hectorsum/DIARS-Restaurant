const controller = {}

controller.home = (req,res)=>{
  res.render('home/home');
}

module.exports = controller;