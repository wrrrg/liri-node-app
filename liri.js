var request = require("request");
var dotenv = require("dotenv").config();
var keys = require("./keys");

// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);



// take the CLI input and save as variable

var inputString = process.argv

var command = inputString[2];
var searchTerm = inputString[3];

var commandsArray = ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"];

function runLiri(command){
  if(commandsArray.indexOf(command) < 0){
    console.log("Please use one of the four given commands!");
  }

  if(command === commandsArray[0]) {
    myTweets();
  } else if (command === commandsArray[1]) {
    spotifyThis(searchTerm);
  } else if (command === commandsArray[2]){
    movieThis(searchTerm);
  } else if (command === commandsArray[3]){
    simonSays();
  }
};

function myTweets(){
  // call should look like "node liri.js my-tweets"
  //recall the last 20 tweets and when they were posted in the terminal
}

function spotifyThis(){
  //should take argument "node liri.js spotify-this-song 'song name'"
  // should return artist(s), song name, preview link of the song from spotify, and the album the song is from
  // if no song is provided, the default is 'The Sign' by Ace of Base
}

function movieThis(){
  //this will take "node liri.js movie-this <movie name>"
  //this should return:
  // the movie title, the year it came out, the IMDB rating the rotten tomatoes rating, the country where it was produced, the movie's language, the plot, and the cast
  // if no movie is specified, the movie will be "Mr. Nobody"

  var movieName = '';
  if(!searchTerm){
    movieName = "Mr+Nobody"
  } else {
    movieName = searchTerm
  };

  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log("Release Year: " + JSON.parse(body).Year);
    }
  });

};

function simonSays(){
  // should take the argument "node liri.js do-what-it-says"

  // it will use the text from random.txt to call another liri command.

  // that means presently it should run spotify-this-song for i want it that way, but we can change it.
};

runLiri(command);
