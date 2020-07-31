const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signin', async(req,res)=>{
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