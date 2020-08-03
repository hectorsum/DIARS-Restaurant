const express = require('express');
const router = express.Router();
const passport = require('passport');
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/signin',islogedin, async(req,res)=>{
  res.render('auth/signin',{title: 'index page',layout: 'index'})
});

router.post('/signin',(req,res,next)=>{
  passport.authenticate('local.signin',{
    successRedirect:'/home',
    failureRedirect:'/signin',
    failureFlash:true
  })(req,res,next);
})

router.get('/logout',(req,res)=>{
  req.logOut();
  res.redirect('/signin')
})

module.exports = router;