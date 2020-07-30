const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signin', async(req,res)=>{
  res.render('auth/signin')
});

router.post('/signin',(req,res,next)=>{
  passport.authenticate('local.signin',{
    successRedirect:'/home',
    failureRedirect:'/signin',
    failureFlash:true
  })(req,res,next);
})

module.exports = router;