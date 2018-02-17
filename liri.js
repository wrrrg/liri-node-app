var dotenv = require("dotenv").config();
var request = require("request");
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);



// take the CLI input and save as variable

var inputString = process.argv

var command = inputString[2];
var searchTerm = inputString[3];

var commandsArray = ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says", "reset-log", "read-log"];

var spacer = "-----------------";

function runLiri(command){
  if(commandsArray.indexOf(command) < 0){
    console.log("Please use one of the four given commands!");
    fs.appendFile("log.txt", "NEW COMMAND" + "\r\n" + "User failed to enter a valid command, ", function(err) {
      if (err) {
        return console.log(err);
      }
    });
  };

  if(command === commandsArray[0]) {
    myTweets();
  } else if (command === commandsArray[1]) {
    spotifyThis(searchTerm);
  } else if (command === commandsArray[2]){
    movieThis(searchTerm);
  } else if (command === commandsArray[3]){
    simonSays();
  } else if (command === commandsArray[4]){
    resetLog();
  } else if (command === commandsArray[5]){
    readLog();
  }
};

function myTweets(){
  // call should look like "node liri.js my-tweets"
  //recall the last 20 tweets and when they were posted in the terminal

  client.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {
    if (error){
      fs.appendFile("log.txt", "NEW COMMAND" + "\r\n" + error, function(err) {
        if (err) {
          return console.log(err);
        }
      });
      console.log(error);
    };
    // If we don't get an error, loop through the tweets
    if (!error) {
      console.log(spacer)
      console.log("Your last 20 tweets: ");
      fs.appendFile("log.txt", "NEW COMMAND" + "\r\n" + "Your last 20 tweets: " + "\r\n", function(err){
        if (err) {
          return console.log(err)
        }
      });

      for (var i = 0; i < 20; i++) {
        var name = tweets[i]["user"]["name"];
        var time = tweets[i]["created_at"];
        var content = tweets[i]["text"];

        console.log(content);
        console.log("(" + name + ", " + time + ")");
        console.log(spacer);

        fs.appendFile("log.txt", "(" + name + ": " + time + "): " + content + "\r\n", function(err) {
          if (err) {
            return console.log(err);
          }
        });


      };
    };

  });
};

function spotifyThis(){
//   //should take argument "node liri.js spotify-this-song 'song name'"
//   // should return artist(s), song name, preview link of the song from spotify, and the album the song is from
//   // if no song is provided, the default is 'The Sign' by Ace of Base
  var song = '';
  var availMarket = 'US'

  if(!searchTerm){
    song = "The Sign Ace Of Base";
  } else {
    song = searchTerm;
  };

  spotify.search({ type: 'track', query: song, limit: 1, market: availMarket}, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  };

// This will give us all of our wanted data via rooting through the object returned to us (within objects, within arrays...spotify really buries the lead here.)
  //

  var songResult = {
    name: data.tracks["items"][0]["name"],
    album: data.tracks["items"][0]["album"]["name"],
    artist: data.tracks["items"][0]["album"]["artists"][0]["name"],
    previewURL: data.tracks["items"][0]["preview_url"]
  }

  console.log("****** Here are your spotify results! *****");
  console.log(spacer);
  console.log("Name of the song: " + songResult.name);
  console.log(spacer);
  console.log("You can find this song on the album: " + songResult.album );
  console.log(spacer);
  console.log("This song is by: " + songResult.artist );
  console.log(spacer);


  var preview = songResult.previewURL;
  var previewResult = '';
  if(!preview){
    previewResult = "Unfortunately, there is no song preview in your market.";
  } else {
    previewResult = "Here's a preview of the song: " + preview;
  };

  console.log(previewResult);

  fs.appendFile("log.txt", "NEW COMMAND" + "\r\n" + "Spotify Result: " + songResult.name + ", Arist: " + songResult.artist + ", Album: " + songResult.album + ", preview: " + previewResult + "\r\n", function(err) {
    if (err) {
      return console.log(err);
    }
  });





  // I can't seem to get a preview URL to load. They all return null - google says that it needs a market to offer a previewURL and I'm not sure how to add one using this api.

  // console.log(data);


});
};


// }

function movieThis(){
  //this will take "node liri.js movie-this <movie name>"
  //this should return:
  // the movie title, the year it came out, the IMDB rating the rotten tomatoes rating, the country where it was produced, the movie's language, the plot, and the cast
  // if no movie is specified, the movie will be "Mr. Nobody"
  var movieResult = {};
  var movieName = '';
  if(!searchTerm){
    movieName = "Mr+Nobody"
  } else {
    movieName = searchTerm
  };

  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
  // console.log(queryUrl);

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).


        movieResult.title = JSON.parse(body).Title,
        movieResult.year = JSON.parse(body).Year,
        movieResult.imdbRating = JSON.parse(body).Ratings[0]["Value"],
        movieResult.rottenTomRating = JSON.parse(body).Ratings[1]["Value"],
        movieResult.country = JSON.parse(body).Country,
        movieResult.language = JSON.parse(body).Language,
        movieResult.plot = JSON.parse(body).Plot,
        movieResult.cast = JSON.parse(body).Actors;

      console.log("Title: " + movieResult.title);
      console.log("Release Year: " + movieResult.year);
      console.log("IMDB Rating: " + movieResult.imdbRating);
      console.log("Rotten Tomatoes Rating: " + movieResult.rottenTomRating);
      console.log("It was produced in: " + movieResult.country);
      console.log("The dialogue is in " + movieResult.language);
      console.log("==============================");
      console.log("SPOILERS: The plot of the movie is: " + movieResult.plot);
      console.log("==============================");
      console.log("The main cast is: " + movieResult.cast);

      fs.appendFile("log.txt", "NEW COMMAND" + "\r\n" + "Movie Title: " + movieResult.title + ", Year: " + movieResult.year + ", IMDB Rating: " + movieResult.imdbRating + ", Rotten Tomatoes Rating: " + movieResult.rottenTomRating + ", Country of Origin: " + movieResult.country + ", Language(s): "+ movieResult.language + ", Plot Summary: " + movieResult.plot + ", Cast: " + movieResult.cast + "\r\n", function(err) {
        if (err) {
          return console.log(err);
        }
      });
    };
  });




};

function simonSays(){
  // should take the argument "node liri.js do-what-it-says"

  // it will use the text from random.txt to call another liri command.

  // that means presently it should run spotify-this-song for i want it that way, but we can change it.
  fs.readFile("random.txt", "utf8", function(error, data){
    if (error) {
      return console.log(error);
    }

    console.log(data);

    var dataArr = data.split(",");

    command = dataArr[0];
    searchTerm = dataArr[1];

    fs.appendFile("log.txt", "USER CALLED SIMON SAYS (reading random.txt)", function(err) {
      if (err) {
        return console.log(err);
      }
    });

    runLiri(command);

  });


};

function resetLog(){
  //This is just to reset the log.txt if you are tired of it being full of gibberish

  fs.writeFile("log.txt", "Liri Log: " + "\r\n", function(){
    console.log("The Liri Log has been cleared.");
  });
};

function readLog(){
  fs.readFile("log.txt", 'utf8', function(err, data){
    if (err) throw err;
    console.log(data);
  });
};



runLiri(command);
