var express = require("express");
// Initialize Express
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

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
app.use(bodyParser.urlencoded({ extended: false }));
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
require("./routes/mongodb-routes")(app);

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
