const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
router.get('/home',isnotlogedin,(req,res)=>{
  res.render('home/home')
})

module.exports = router;