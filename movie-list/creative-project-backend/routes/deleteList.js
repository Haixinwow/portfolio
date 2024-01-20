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
    console.log("connected in deleteList");
});

router.delete(['/', '/deleteList'], (req, res) => {
    const listId = req.query.id;
    console.log(listId)

    connection.query('DELETE FROM movie_list WHERE list_id = ?', [listId], (error) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error deleting list from database');
        } else {
            res.status(200).json({ success: true });
        }
    });
})
module.exports = router;