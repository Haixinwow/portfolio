const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { userInfo } = require('os');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'wustl_inst',
    password: 'wustl_pass',
    database: 'movies'
});

connection.query('/', function (req, res) {
    console.log("connected in friends");
});

router.post('/', (req, res) => {
    console.log(req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { friendname, user } = req.body;

    //get id from the logged in username
    connection.query('SELECT user_id FROM users WHERE username =?', [user], (error, results) => {
        console.log("name test: " + user);
        console.log("you name test: " + results[0].user_id);
        let user_id = results[0].user_id;
        if (error) {
            console.log("Failed to connect");
            return res.status(400).json({ error: "connection failed" });
        } 
        if (user == friendname) {
            console.log("goofball");
            return res.status(400).json({ error: "you cannot friend yourself" });
        } 
        else {
            //if an id is found with the username, add their list to sql
            connection.query('SELECT username FROM users WHERE username =?', [friendname], (error, results) => {
                console.log("test user id: " + user_id);
                if (error) {
                    console.log("Failed to create user");
                    return res.status(400).json({ error: "Request body is missing" });
                } 
                if (results.length > 0) {
                    console.log("friend name: " + friendname);
                    // console.log("your name: " + user_id);

                    const query = `INSERT INTO friends (user_id, friend_name ) VALUES (?, ?)`;

                    connection.query(query, [user_id, friendname], (error, results) => {
                        if (error) {
                            console.log("Failed to add to list");
                            return res.status(400).json({ error: "could not add friend" });
                        } else {
                            return res.status(200).json({ message: "success" });
                        }
                    });

                }
            });
        }
    })



});

module.exports = router;