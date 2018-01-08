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
                        // console.log(dbArticle);
                    }).catch(function (err) {
                        // If an error occurred, log it, with the catch statement, the program won't crash when it runs into a duplicate key error
                        console.log(err.errmsg);
                    })
            })
            res.json(results);
        });

    });

    //   Route for getting only the saved Articles from the db
    app.get("/saved-articles", function (req, res) {

        // Find all saved articles
        db.Article
            .find({
                isSaved: true
            })
            .then(function (dbArt) {
                if (dbArt) {
                    let hbsObject = {
                        articles: dbArt
                    };
                    // console.log(dbArt)
                    res.render("saved", hbsObject);
                } else {
                    res.send(dbArt);
                }
            }).catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    });


    // Route for grabbing a specific Article by id, populate it with it's note
    app.post("/save-article/:id", function (req, res) {
        db.Article
            .findOneAndUpdate({
                _id: req.params.id
            }, {
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
    });
    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article
            .findOne({
                _id: req.params.id
            })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                if (dbArticle.notes) {
                    res.send(dbArticle.notes);
                } else {
                    res.send(dbArticle);
                }
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        db.Note
            .create(req.body)
            .then(function (dbNote) {
                console.log("This is dbnote: " + dbNote);
                console.log(dbNote._id);
                // dbNote._id = mongoose.Types.ObjectId(dbNote._id);
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        notes: dbNote._id
                    }
                }, {
                    new: true
                });
                // return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            }).then(function (dbArt) {
                console.log("This is dbArt: " + dbArt.notes);
                // If the User was updated successfully, send it back to the client
                res.json(dbArt);
            })
            .catch(function (err) {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    });
    app.delete("/notes/:id/:articleId", function (req, res) {
        // Equivalent to `parent.children.pull(_id)`
        console.log(req.params.id);
        console.log(req.params.articleId);
        db.Article.update( { _id: req.params.articleId }, { $pullAll: { notes: [req.params.id] } } )
        .then(function(dbArt){

            console.log(dbArt);
            res.json(dbArt);
        });
    });
};
