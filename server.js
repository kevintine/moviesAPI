const express = require('express');
const app = express();
const port = 3000;

// importing npm packages
const cors = require('cors');
const dotenv = require('dotenv').config();

// importing other modules as well as creating a instance of it to work with
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

// initalizing mongoDB connection
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

// routes
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// This route uses the body of the request to add a new "Movie" document 
// to the collection and return the newly created movie object / fail message to the client.
app.post('/movies', (req, res) => {
    try {
        db.addNewMovie(data)
    } catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    };
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});