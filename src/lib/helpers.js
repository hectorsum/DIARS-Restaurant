const moment = require('moment');
const numeral = require('numeral');
const helpers = {};

helpers.index = (index) =>{
  index++
  return index;
}

helpers.formatdaytime = (time)=>{
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}

helpers.money= (number) =>{
  var number = numeral(number);
  const money ='S/'+number.format('0,0.00')
  return money;
}

module.exports = helpers;