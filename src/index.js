const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');

//Initializations
const app = express();

//Settings 
app.set('port',process.env.PORT || 4000);
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
app.use(morgan('dev'));


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/auth'));

//Public
app.use(express.static(path.join(__dirname,'public')));

//Starting Server
app.listen(app.get('port'),()=>{
  console.log('Server on port: ',app.get('port'));
});