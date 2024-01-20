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
    console.log("connected in comments");
});

router.post('/', (req, res) => {
    console.log(req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { comment, user, movieId } = req.body;
    if(comment == '') {
        return res.status(400).json({ error: "empty string" });
    }
    //get id from the logged in username   
            //if an id is found with the username, add their list to sql
    const query = `INSERT INTO comments (movie_id, comment, username) VALUES (?, ?, ?)`;

    connection.query(query, [movieId, comment, user], (error, results) => {
        if (error) {
            console.log("Failed to add to comments");
            return res.status(400).json({ error: "could not add comment" });
        } else {
            return res.status(200).json({ message: "success" });
        }
    });
        
    



});

module.exports = router;