/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Kevin Tran           Student ID: 026411140            Date: 2023-01-28
*  Cyclic Link: https://tan-betta-tux.cyclic.app
*
********************************************************************************/ 


const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bodyparser = require('body-parser');
const path = require("path");

// importing other modules as well as creating a instance of it to work with
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

// initalizing mongoDB connection
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(port, ()=>{
        console.log(`server listening on: ${port}`);
    });
}).catch((err)=>{
    console.log(err);
});

// routes
// use css and js files
app.use(express.static(path.join(__dirname, "/css")));
app.use(express.static(path.join(__dirname, "/js")));
app.use(bodyparser.json());
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// This route uses the body of the request to add a new "Movie" document 
// to the collection and return the newly created movie object / fail message to the client.
app.post('/movies', (req, res) => {
    try {
        db.addNewMovie(req.body).then
        (data => {
            res.json(data);
        }).catch(err => {
            res.status(500).send(err.message);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    };
});
//This route must accept the numeric query parameters "page" and "perPage" as well as the (optional) 
//string parameter "title", ie: /api/movies?page=1&perPage=5&title=The Avengers.
//It will use these values to return all "Movie" objects for a specific "page" to the client 
//as well as optionally filtering by "title", if provided (in this case, it will show both “The Avengers” films).
app.get('/movies', (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//This route must accept a route parameter that represents the _id of the desired movie object, ie: /api/movies/573a1391f29313caabcd956e.  
//It will use this parameter to return a specific "Movie" object to the client.
app.get('/movies/:id', (req, res) => {
    try {
        db.getMovieById(req.params.id).then
        (data => {
            res.json(data);
        }).catch(err => { 
            res.status(500).send(err.message);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    };
});
//This route must accept a route parameter that represents the _id of the desired movie object, ie: /api/movies/573a1391f29313caabcd956e 
//as well as read the contents of the request body.
//It will use these values to update a specific "Movie" document in the collection and return a success / fail message to the client.
app.put('/movies/:id', (req, res) => {
    try {
        db.updateMovieById(req.params
        .id
        , req
        .body).then
        (data => {
            res.json(data);
        }).catch(err => {
            res.status(500).send(err.message);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    };
});
//This route must accept a route parameter that represents the _id of the desired movie object, ie: /api/movies/573a1391f29313caabcd956e.  
//It will use this value to delete a specific "Movie" document from the collection and return a success / fail message to the client.
app.delete('/movies/:id', (req, res) => {
    try {
        db.deleteMovieById(req.params.id).then
        (data => {
            res.json(data);
        }).catch(err => {
            res.status(500).send(err.message);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    };
});

// Delete a student using the route "/api/students/id" (ie: /api/students/579365473).  
//When successful, return the JSON formatted object: {message:"Student with ID 579365473 has been deleted"}
app.delete('/students/:id', (req, res) => {
    try {
        db.deleteStudentById(req.params.id).then
        (data => {
            res.json('Student with ID ' + req.params.id + ' has been deleted');
        }).catch(err => {
            res.status(500).send(err.message);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    };
});


