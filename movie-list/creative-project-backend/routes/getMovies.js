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
    console.log("connected in getMovies");
});

router.get(['/', '/getMovies'], (req, res) => {
    connection.query("SELECT * FROM movie_collection", (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching movies');
        }else{
            console.log(results);
            res.send(results);
        }
    })
})
module.exports = router;