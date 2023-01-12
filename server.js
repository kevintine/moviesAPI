const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bodyparser = require('body-parser');

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
app.use(bodyparser.json());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
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
    try {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then
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


