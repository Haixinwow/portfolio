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
    console.log("connected in getLists");
});

router.get(['/', '/getLists'], (req, res) => {
    console.log("req:" + req.query.user);

    if (!req.query.user) {
        return res.status(400).json({ error: "Not logged in" });
    }

    const user = req.query.user;
    console.log("user:" + user);

    //get id from the logged in username
    connection.query('SELECT user_id FROM users WHERE username =?', [user], (error, results) => {
        if (error) {
            console.log("Failed to connect");
            return res.status(400).json({ error: "connection failed" });
        } else if (results.length > 0) {
            //if an id is found with the username, get their lists from sql
            let user_id = results[0].user_id;
            const friends = `SELECT * FROM friends where friend_name = ?`;

            //check if user has friends to display only their lists or also friend lists
            connection.query(friends, [user], (error, results) => {
                if (error) {
                    console.log("Failed to get lists");
                    return res.status(400).json({ error: "could not get lists" });
                } else if (results.length > 0) {
                    //has friends
                    console.log(`Found ${results.length} friends for ${user}`);
                    console.log(results[0])
                    let friend = results[0];

                    let result = [];
                    const query = `SELECT * FROM movie_list WHERE list_owner_id = ?`
                    connection.query(query, [user_id], (error, results) => {
                        if (error) {
                            console.log("Failed to get lists");
                            return res.status(400).json({ error: "could not get lists" });
                        } else {
                            result.push(results);
                        }
                    });

                    console.log(result);
                    const query2 = `SELECT * FROM movie_list WHERE list_owner_id = ?`
                    connection.query(query2, [friend.user_id], (error, results) => {
                        if (error) {
                            console.log("Failed to get lists");
                            return res.status(400).json({ error: "could not get lists" });
                        } else {
                            result.push(results);
                        }
                    });

                    console.log(result);

                    return res.status(200).json({ lists: result });

                } else {
                    //no friends
                    const query = `SELECT * FROM movie_list WHERE list_owner_id = ?`;

                    connection.query(query, [user_id], (error, results) => {
                        if (error) {
                            console.log("Failed to get lists");
                            return res.status(400).json({ error: "could not get lists" });
                        } else {
                            console.log(`Found ${results.length} lists for ${user}`);
                            return res.status(200).json({ lists: results });
                        }
                    });
                }
            });


        }
    });
});


module.exports = router;