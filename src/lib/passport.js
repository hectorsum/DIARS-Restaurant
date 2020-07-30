const passport = require('passport');
const localstrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new localstrategy({
  usernameField:'usuario',
  passportField:'password',
  passReqToCallback: true
}, async(req,username,password,done)=>{
  const rows = await pool.query('SELECT * FROM usuario_emp WHERE usuario = ?',[username]);
  if(rows.length > 0){
    const user = rows[0];
    if(user.password === password){
      return done(null,user,req.flash('success','Welcome'));
    }else{
      return done(null,false,req.flash('failure','Incorrect password'));
    }
  }else{
    return done(null,false,req.flash('failure','Account doesnt exists'));
  }
}));

passport.serializeUser((user,done)=>{
  done(null,user.cod_usuario_emp)
})

passport.deserializeUser(async(id,done)=>{
  const rows = await pool.query('SELECT * FROM usuario_emp WHERE cod_usuario_emp = ?',[id]);
  done(null,rows[0]);
})
