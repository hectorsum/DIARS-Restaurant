const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signin', (req,res)=>{
  res.render('auth/signin')
});

module.exports = router;