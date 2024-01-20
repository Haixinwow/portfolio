const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'wustl_inst',
    password: 'wustl_pass',
    database: 'movies'
});

connection.query('/', function (req, res) {
    console.log("connected in users");
});

router.post('/', (req, res) => {
    console.log(req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { username, password } = req.body;
    if(username == '' || password == '') {
        return res.status(400).json({ error: "Empty username/password" });
    }

    //check if user is in database, if not add them, if so, check password to login
    connection.query('SELECT username FROM users WHERE username =?', [username], (error, results) => {
        if (error) {
            console.log("Failed to create user");
            return res.status(400).json({ error: "Request body is missing" });
        }
        //check repeating username/login 
        if (results.length > 0) {
            // console.log("Repeating name pls work");
            connection.query('SELECT password FROM users WHERE username =?', [username], (error, results) => {
                // console.log("results: " + results[0].password);
                // console.log("password: " + password);
                if(error) {
                    console.log("Failed to connect");
                    return res.status(400).json({ error: "connection failed" });
                } else if (results[0].password === password) {
                    // console.log("works");
                    return res.status(200).json({ message: "success" });
                } 
            })
        }
        // console.log("username which cannot be null: " + results[0].username);
        if (!results.length > 0) {
            // Insert the new user into the database
            const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
            
            connection.query(query, [username, password], (error, results) => {
                if (error) {
                    console.log("Failed to create user");
                    return res.status(400).json({ error: "Repeating username" });
                } else {
                    console.log(`User created successfully: ${username}`);
                    return res.status(200).json({ message: "success" });
                }
            });
        }
    });
});

router.get('/', (req, res) => {
    res.json([
        {
            username: "test name",
            age: 100
        },
        {
            username: "test name2",
            age: 10
        }
    ])
})

module.exports = router;