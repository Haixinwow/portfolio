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
    console.log("connected in getComments");
});

router.get(['/', '/getComments'], (req, res) => {
    const movieId = req.query.movieId;
    console.log("getting data from comments");
    connection.query('SELECT * FROM comments WHERE movie_id =?', [movieId], (error, results) => {
        if (error) {
            console.log("Failed to connect");
            return res.status(400).json({ error: "connection failed" });
        } else {
            console.log(results.length);
            return res.status(200).json({ listComment: results });

        }
    })



});

module.exports = router;