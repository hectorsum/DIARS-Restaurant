const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
  // res.send('HOME')
  // Aiming layouts/index for webpage
  res.render('web/index',{layout:'index'})
});


module.exports = router;