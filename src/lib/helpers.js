const moment = require('moment');
const numeral = require('numeral');
const bcrypt = require('bcryptjs');
const helpers = {};

helpers.index = (index) =>{
  index++
  return index;
}

helpers.select = ('select', function(selected, options) {
  return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& selected="selected"');
});

helpers.formatdaytime = (time)=>{
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}

helpers.money= (number) =>{
  var number = numeral(number);
  const money ='S/'+number.format('0,0.00')
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

module.exports = helpers;