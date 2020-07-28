const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
  // res.send('HOME')
  // Aiming layouts/index for webpage
  res.render('layouts/index',{title:'index page',layout:'index'})
});


module.exports = router;