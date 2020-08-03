module.exports={
  isnotlogedin(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    return res.redirect('/signin');
    //*Si no esta logeado redirecciona al signin
  },
  islogedin(req,res,next){
    if(!req.isAuthenticated()){
      return next();
    }
    return res.redirect('/home');
    //*Si esta logeado redirecciona al home
  }
}