const { Pool } = require('pg');

const pool = new Pool({
    user: 'myuser',     //your postgres username
    host: 'localhost', 
    database: 'lab5db', //your local database 
    password: 'mypass', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();


module.exports = pool;