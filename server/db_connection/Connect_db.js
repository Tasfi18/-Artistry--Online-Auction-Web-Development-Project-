const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '210238moin',
    database: 'ae_db'
});

db.connect((err)=>{
    if(err){
        console.error("XXX connection problem XXX");
    }
    else{
        console.log('Connected to AE_DB');
    }
});

module.exports = db;