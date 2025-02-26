const mysql = require("mysql2") ;
require("dotenv").config();


const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 20,
})

connection.getConnection((err, conn) => {
    if(err){
        console.error("Error connection to database:",err);
    }
    else{
        console.log("connected to  database")
        conn.release();
    }
});

module.exports =connection;