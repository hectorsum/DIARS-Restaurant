const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const {database} = require('./key');
const { allowedNodeEnvironmentFlags } = require('process');
const passport = require('passport');


//Initializations
const app = express();
require('./lib/passport');

//Settings 
app.set('port',process.env.PORT || 5000);
app.set('view engine','.hbs');
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
  defaultLayout:'main',
  layoutsDir: path.join(app.get('views'),'layouts'),
  partialsDir: path.join(app.get('views'),'partials'),
  extname:'.hbs',
  helpers: require('./lib/helpers')
}));

//*Other 'main' layout for index webpage
app.set('view options',{layout:'index'})

//Middlewares
app.use(session({
  secret:'hectorsum',
  resave:false,
  saveUninitialized:false,
  store:new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req,res,next)=>{
  app.locals.success = req.flash('success');
  app.locals.failure = req.flash('failure');
  app.locals.user = req.user;
  next();
})

//Routes
//*Specifying route bc we're using edit,delete in there
app.use('/generar-cuenta',require('./routes/generar-cuenta'));
app.use('/mantener-producto',require('./routes/mantener-producto'));
app.use('/mantener-entrada',require('./routes/mantener-entrada'));
app.use('/mantener-segundo',require('./routes/mantener-segundo'));
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use(require('./routes/home'));

//Public
app.use(express.static(path.join(__dirname,'public')));

//Starting Server
app.listen(app.get('port'),()=>{
  console.log('Server on port: ',app.get('port'));
});