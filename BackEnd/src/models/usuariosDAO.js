const mysql = require("mysql");

const USER = process.env.USER || 'root';

const con = mysql.createConnection({
    host: 'localhost',
    database: 'offside',
    user: 'root'
});

module.exports = con;