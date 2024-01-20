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
    console.log("connected in getRating");
});

router.post(['/', '/getRating'], (req, res) => {
    // const movieId = req.body.movieId;
    // const user = req.query.user;
    const { user, movieId } = req.body;
    console.log("test " + user);
    console.log("movie " + movieId);
    console.log("getting data from rating user");
    connection.query('SELECT user_id FROM users WHERE username =?', [user], (error, results) => {
        console.log("user id" + results[0].user_id);
        
        let user_id = results[0].user_id;
        if (error) {
            console.log("Failed to connect");
            return res.status(400).json({ error: "connection failed" });
        } else {
            connection.query('SELECT rating FROM rated_movies WHERE movie_id =? AND rate_user_id=?', [movieId, user_id], (error, results) => {
                if (error) {
                    console.log("Failed to connect again");
                    return res.status(400).json({ error: "connection failed" });
                } else {
                    console.log(results);

                    return res.status(200).json({ rating: results });
                }
            })
        }
    })
   
});

module.exports = router;