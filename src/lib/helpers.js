const moment = require('moment');
const numeral = require('numeral');
const bcrypt = require('bcryptjs');
const helpers = {};
const Handlebars = require('handlebars');

helpers.index = (index) =>{
  index++
  return index;
}

helpers.select = ('select', function(selected, options) {
  return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& selected="selected"');
});

helpers.toFixed = (elem)=>{
  return elem.toFixed(2);
}

helpers.formatdaytime = (time)=>{
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}
helpers.formatdatetodb = (time)=>{
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}
helpers.formatdate = (time)=>{
  return moment(time).format('DD/MM/YYYY')
}

helpers.ifEquals = Handlebars.registerHelper('ifEquals', function(arg1,arg2, options) {
  console.log(options.inverse(this))
  return (arg1==arg2) ? options.fn(this) : options.inverse(this);
});

helpers.ifNotProducto = Handlebars.registerHelper('ifNotProducto',function(arg1){
  return (arg1!='producto');
})

helpers.money= (number) =>{
  var number = numeral(number);
  const money ='S/ '+number.format('0,0.00')
  return money;
}

helpers.encryptpassword = async(password) =>{
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password,salt);
  return hash;
}

helpers.decryptpassword = async(password)=>{
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.decodeBase64(password);
  return hash;
}

helpers.matchpassword = async(password,savedpassword) =>{
  try{
    return await bcrypt.compare(password,savedpassword);
  }catch(e){
    return false;
  }
}

helpers.Capitalize = Handlebars.registerHelper('capitalize',function(str){
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

module.exports = helpers;