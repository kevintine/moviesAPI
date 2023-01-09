const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  num_mflix_comments: Number,
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: Date,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  type: String,
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    dvd: Date,
    lastUpdated: Date
  }
}
);

module.exports = class MoviesDB {
  constructor() {
    // We don't have a `Movie` object until initialize() is complete
    this.Movie = null;
  }

  // Pass the connection string to `initialize()`
  // Establish a connection with the MongoDB server and initialize the "Movie" model with the "movies" collection (used above)
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(
        connectionString,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );

      db.once('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        this.Movie = db.model("movies", movieSchema);
        resolve();
      });
    });
  }
  // Create a new movie in the collection using the object passed in the "data" parameter
  async addNewMovie(data) {
    const newMovie = new this.Movie(data);
    await newMovie.save();
    return newMovie;
  }
  // Return an array of all movies for a specific page (sorted by year), given the number of items per page.  
  // For example, if page is 2 and perPage is 5, then this function would return a sorted list of movies (by year), 
  // containing items 6 – 10.  This will help us to deal with the large amount of data in this dataset and 
  // make paging easier to implement in the UI later.
  // Additionally, there is an optional parameter "title" that can be used to filter results by a specific (case sensitive) "title" value
  getAllMovies(page, perPage, title) {
    let findBy = title ? { title } : {};

    if (+page && +perPage) {
      return this.Movie.find(findBy).sort({ year: +1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
    }

    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  getMovieById(id) {
    return this.Movie.findOne({ _id: id }).exec();
  }

  updateMovieById(data, id) {
    return this.Movie.updateOne({ _id: id }, { $set: data }).exec();
  }

  deleteMovieById(id) {
    return this.Movie.deleteOne({ _id: id }).exec();
  }
}