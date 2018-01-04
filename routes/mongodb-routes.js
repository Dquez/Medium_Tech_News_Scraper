// *********************************************************************************
// mongodb-routes.js - this file offers a set of routes for manipulating the db and scraping Medium.com based on client requests
// *********************************************************************************

// Dependencies
// =============================================================
const path = require("path");
const db = require("../models");
const request = require("request");
const cheerio = require("cheerio");
// Routes
// =============================================================
module.exports = function (app) {


    app.get("/", function (req, res) {
        console.log("path  at /");
        res.render("home");
    });

    app.get("/home", function (req, res) {
        res.render("home");
    });


    // var hbsObject = {
    //     cats: data
    //   };
    //   console.log(hbsObject);
    //   res.render("index", hbsObject);
    // });
    app.get("/scrape", function (req, res) {
        request("https://medium.com/topic/technology", function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);

            // An empty array to save the data that we'll scrape
            var results = [];

            // Select each element in the HTML body from which you want information.
            // NOTE: Cheerio selectors function similarly to jQuery's selectors,
            // but be sure to visit the package's npm page to see how it works
            $("div.js-trackedPost").each(function (i, element) {
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
            // res.json(results);

            // let newData = [];
            results.forEach(function (data) {
                db.Article
                    .create(data)
                    .then(function (dbArticle) {
                        // res.send("Scrape Complete");
                        console.log(dbArticle);
                    }).catch(function (err) {
                        // If an error occurred, log it, with the catch statement, the program won't crash when it runs into a duplicate key error
                        console.log(err.errmsg);
                    })
            })
            res.redirect("/");
        });
    });


// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    // Find all Notes
    db.Article
      .find({})
      .then(function (dbArt) {
        // If all Notes are successfully found, send them back to the client
        res.send(dbArt);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/save-article/:id", function (req, res) {
    // TODO
    // ====
    db.Article
      .findOneAndUpdate({_id: req.params.id}, {
        $set: {
          isSaved: true
        }
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
  
};