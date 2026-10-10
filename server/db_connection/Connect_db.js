const mysql = require('mysql');

// Connection settings come from server/.env (see .env.example).
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ae_db'
});

db.connect((err)=>{
    if(err){
        console.error('Could not connect to MySQL:', err.code || err.message);
    }
    else{
        console.log(`Connected to database ${db.config.database}`);
    }
});

module.exports = db;
