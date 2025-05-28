// backend/db.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Replace with your MySQL username
    password: 'Namita15',         // Replace with your MySQL password
    database: 'food_donation_db'
});

// Connect and check for errors
connection.connect((err) => {
    if (err) {
        console.error('MySQL connection failed: ', err);
    } else {
        console.log('Connected to MySQL database ✅');
    }
});

module.exports = connection;
