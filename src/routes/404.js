const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/*',(req,res)=>{
  if(res.status(404)){
    res.render('not-found/404',{layout:null});
  }else{
    res.render('*',{layout:'index'});
  }
});

module.exports = router;