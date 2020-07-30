const mysql = require('mysql');
const {promise,promisify} = require('util');
const {database} = require('./key');
const {connect} = require('http2');

const pool = mysql.createPool(database);

pool.getConnection((err,connection)=>{
  if(err){
    if(err.code==='PROTOCOL_CONNECTION_LOST'){
      console.log('DATABASE CONNECTION WAS CLOSED');
    }
    if(err.code==='ER_CON_COUNT_ERROR'){
      console.log('DATABASE HAS TOO MANY CONNECTIONS');
    }
    if(err.code==='ECONNREFUSED'){
      console.log('DATABASE CONNECTION WAS REFUSED');
    }
  }
  if(connection){
    console.log('DB is connected');
  }
  return;
})

//* Promisify pool query
pool.query = promisify(pool.query);

module.exports = pool;
