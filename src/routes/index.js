const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/',async (req,res)=>{
  // res.send('HOME')
  // Aiming layouts/index for webpage
  const carta = await pool.query("SELECT * FROM carta WHERE categoria LIKE 'producto' and estado=1")
  res.render('web/index',{carta,layout:'index'});
});


module.exports = router;