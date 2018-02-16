var dotenv = require("dotenv").config();
var keys = require("./keys");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function myTweets(){
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

}

function simonSays(){
  // should take the argument "node liri.js do-what-it-says"

  // it will use the text from random.txt to call another liri command.

  // that means presently it should run spotify-this-song for i want it that way, but we can change it.
}
