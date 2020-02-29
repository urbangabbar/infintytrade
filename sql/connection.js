const mysql = require('mysql');
const connection = mysql.createPool({
    host: 'remotemysql.com',
    port: '3306',
    user: 'uCm8mKTiq6',
    password: 'CwnbZW3PPk',
    database: 'uCm8mKTiq6'
});
module.exports = connection;