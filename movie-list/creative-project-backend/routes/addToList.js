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

router.post(['/', '/addToList'], (req, res) => {
    console.log(req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { listId, movieId } = req.body;
    
    const query = `INSERT INTO movie_collection (list_id, movie_id) VALUES (?, ?)`;

    //get id from the logged in username
    connection.query(query, [listId, movieId], (error, results) => {
        if (error) {
            console.log("Failed to add movie to list");
            return res.status(400).json({ error: "could not add movie to list" });
        } else {
            console.log(`Added movie to list successfully`);
            return res.status(200).json({ success: true });
        }
    });



});

module.exports = router;