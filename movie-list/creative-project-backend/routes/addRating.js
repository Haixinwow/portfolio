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
    console.log("connected in rated_movies");
});

router.post('/', (req, res) => {
    console.log(req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { rating, user, movieId } = req.body;

    connection.query('SELECT user_id FROM users WHERE username =?', [user], (error, results) => {
        let user_id = results[0].user_id;
        if (error) {
            console.log("Failed to connect");
            return res.status(400).json({ error: "connection failed" });
        } else {
            const query1 = 'SELECT rate_user_id FROM rated_movies WHERE movie_id =? AND rate_user_id=?'
            connection.query(query1, [movieId, user_id], (error, results) => {
                if (error) {
                    console.log("Failed to add to rate");
                    return res.status(400).json({ error: "could not add a rating" });
                }
                else if(results.length) {
                    console.log(results);
                    console.log("cannot have more than 1 rating per movie");
                    return res.status(400).json({ error: "cannot have more than 1 rating per movie" });
                } else {
                    const query2 = `INSERT INTO rated_movies (movie_id, rating, rate_user_id) VALUES (?, ?, ?)`;

                    connection.query(query2, [movieId, rating, user_id], (error, results) => {
                        if (error) {
                            console.log("Failed to add to rating");
                            return res.status(400).json({ error: "could not add rating" });
                        } else {
                            return res.status(200).json({ message: "success" });
                        }
                    });
                }
            });
      
           
        }
    }); 
    



});

module.exports = router;