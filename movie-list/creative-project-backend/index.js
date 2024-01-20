var express = require('express');
var app = express();
const port = 3456;
const users = require("../creative-project-backend/routes/users");
const listUpload = require("../creative-project-backend/routes/listUpload");
const beFriend = require("../creative-project-backend/routes/beFriend");
const getLists = require("../creative-project-backend/routes/getLists");
const addToList = require("../creative-project-backend/routes/addToList");
const addComments = require("../creative-project-backend/routes/addComments");
const getComments = require("../creative-project-backend/routes/getComments");
const getMovies = require("../creative-project-backend/routes/getMovies");
const deleteList = require("../creative-project-backend/routes/deleteList");
const deleteMovieFromList = require("../creative-project-backend/routes/deleteMovieFromList");
const addRating = require("../creative-project-backend/routes/addRating");
const getRating = require("../creative-project-backend/routes/getRating");

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use("/users", users);
app.use("/listUpload", listUpload);
app.use("/beFriend", beFriend);
app.use("/getLists", getLists);
app.use("/addToList", addToList);
app.use("/addComments", addComments);
app.use("/getComments", getComments);
app.use("/getMovies", getMovies);
app.use("/deleteList", deleteList);
app.use("/deleteMovieFromList", deleteMovieFromList);
app.use("/addRating", addRating);
app.use("/getRating", getRating);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  
app.get('/', function(req, res) {
    res.send("API is working properly");
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host:'localhost',
  user:'wustl_inst',
  password:'wustl_pass',
  database:'movies'
});

connection.query('/', function(req, res) {
  console.log("connected in main");
});
