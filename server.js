var express = require("express");
// Initialize Express
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

const PORT = process.env.PORT || 3000;


const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
 

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
 
// Sets up the Express middleware to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var localDB = 'mongodb://localhost/MediumScraper'
var MONGODB_URI = process.env.MONGODB_URI || localDB;

mongoose.connect(MONGODB_URI);
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/week18Populater", {
//   useMongoClient: true
// });

// Routes
// =============================================================
require("./routes/html-routes")(app);
// require("./routes/user-api-routes")(app);
// require("./routes/inventory-api-routes")(app);

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

app.get("/web", function(req, res){
  request("https://medium.com/topic/technology", function(error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // An empty array to save the data that we'll scrape
      var results = [];

      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("div.js-trackedPost").each(function(i, element) {

        // Headline - the title of the article
        
        // Summary - a short summary of the article
        
        // URL - the url to the original article
        
        
        var headline = $(element).find("h3").text();
        var summary = $(element).find("h4").text();
        var url = $(element).find("a").attr("href");
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          headline: headline,
          summary: summary,
          url: url
        });

      });
      res.json(results);

      // let newData = [];
      // results.forEach(function(data){
      //   db.scrapedData.insert({
      //     id: data.id,
      //     link: data.link
      //   }, function(error, found) {
      //     // Log any errors if the server encounters one
      //     if (error) {
      //       console.log(error);
      //     }
      //     newData.push(found)
      //     // Otherwise, send the result of this query to the browser
      //   });
      // }) 
      // res.json(newData);

      // Log the results once you've looped through each of the elements found with cheerio
      // console.log(results);
    });

})

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  // Find all Notes
  db.Article
    .find({})
    .then(function (dbArt) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbArt);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  db.Article
    .find({
      _id: req.params.id
    })
    .then(function (dbArt) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbArt);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  // ====
  console.log(req.body);
  db.Note
    .save(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({}, {
        $push: {
          note: req.params.id
        }
      }, {
        new: true
      });
    })
    .then(function (dbArt) {
      // If the User was updated successfully, send it back to the client
      res.json(dbArt);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
