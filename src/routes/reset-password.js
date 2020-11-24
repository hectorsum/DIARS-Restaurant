const express = require('express');
const router = express.Router();
const pool = require('../database');
const mailgun = require('mailgun-js');
const jwt = require('jsonwebtoken');
const DOMAIN = "";


router.get('/reset-password',(req,res)=>{
  res.render('auth/reset-password',{layout:'index'})
})

router.post('/reset-password',async(req,res)=>{
  const {email} = req.body;
})

module.exports = router;