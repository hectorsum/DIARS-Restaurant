const controller = {}
const pool = require('../database');
const passport = require('passport');

controller.get_auth = async(req,res) =>{
  res.render('auth/signin',{title: 'index page',layout: 'index'})
}
controller.post_auth = async(req,res,next)=>{
  passport.authenticate('local.signin',{
    successRedirect:'/home',
    failureRedirect:'/signin',
    failureFlash:true
  })(req,res,next);
}
controller.get_logout = async(req,res)=>{
  req.logOut();
  res.redirect('/signin')
}
module.exports = controller;