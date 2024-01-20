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
    console.log("connected in listUpload");
});

router.post('/', (req, res) => {
    console.log(req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { listName, user } = req.body;
    
    //get id from the logged in username
    connection.query('SELECT user_id FROM users WHERE username =?', [user], (error, results) => {
        if (error) {
            console.log("Failed to connect");
            return res.status(400).json({ error: "connection failed" });
        } else {
            //if an id is found with the username, add their list to sql
            let user_id = results[0].user_id;
            const query = `INSERT INTO movie_list (list_name, list_owner_id ) VALUES (?, ?)`;

            connection.query(query, [listName, user_id], (error, results) => {
                if (error) {
                    console.log("Failed to add to list");
                    return res.status(400).json({ error: "could not add list" });
                } else {
                    console.log(`Added to list successfully: ${listName}`);
                    return res.status(200).json({ message: "success" });
                }
            });
        }
    })



});

module.exports = router;