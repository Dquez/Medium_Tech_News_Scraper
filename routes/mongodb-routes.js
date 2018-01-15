// *********************************************************************************
// mongodb-routes.js - this file offers a set of routes for manipulating the db and scraping Medium.com based on client requests
// *********************************************************************************

// Dependencies
// =============================================================
const path = require("path");
const db = require("../models");
const request = require("request");
const cheerio = require("cheerio");
// Routes on the exports object
// =============================================================
module.exports =  (app) => {
    app.get("/scrape",  (req, res) => {
        request("https://medium.com/topic/technology", (error, response, html) => {

            // Load the HTML into cheerio and save it to a constiable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            const $ = cheerio.load(html);

            // An empty array to save the data that we'll scrape
            let results = [];
            //this is the div which is common amongst all our desired articles so we use this as the "parent" from which we scrape the children
            $("div.js-trackedPost").each((i, element) => {
                const headline = $(element).find("h3").text();
                const summary = $(element).find("h4").text();
                const url = $(element).find("a").attr("href");
                let imgURL = $(element).find("a").css('background-image');
                // this takes out the leading unwanted characters when we get a background image URL attribute
                imgURL = imgURL.split('url("')[1];
                // this takes out the trail quotation mark and closing parenthesis
                imgURL = imgURL.replace('")', "");
                // Save these results in an object that we'll push into the results array we defined earlier
                results.push({
                    headline: headline,
                    summary: summary,
                    url: url,
                    imgURL : imgURL
                });

            });
            // create an article in our database for each article obj pushed into the results array with predefined keys that correspond to the keys of the database collection
            results.forEach(data => {
                db.Article
                    .create(data)
                    .then(dbArticle => {
                        
                    }).catch(err => {
                        // If an error occurred, log it, with the catch statement, the program won't crash when it runs into a duplicate key error
                        console.log(err.errmsg);
                    })
            })  
            res.send(results);   
        });

    });

    //   Route for getting only the saved Articles from the db
    app.get("/saved-articles",(req, res) => {

        // Find all saved articles
        db.Article
            .find({
                isSaved: true
            })
            .then(dbArt => {
                if (dbArt) {
                    let hbsObject = {
                        articles: dbArt
                    };
                    
                    res.render("saved", hbsObject);
                } else {
                    res.send(dbArt);
                }
            }).catch(err => {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    });


    // Route for grabbing a specific Article by id, populate it with it's notes
    app.post("/save-article/:id", (req, res) => {
        db.Article
            .findOneAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    isSaved: true
                }
            })
            .then( dbArt => {
                // If all Notes are successfully found, send them back to the client
                res.json(dbArt);
            })
            .catch( err => {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", (req, res) => {
        db.Article
            .findOne({
                _id: req.params.id
            })
            //populate all of the notes associated with the article queried
            .populate("notes")
            .then(dbArticle => {
                // If we were able to successfully find an Article with the given id, send it back to the client
                if (dbArticle.notes) {
                    res.send(dbArticle.notes);
                } else {
                    res.send(dbArticle);
                }
            })
            .catch(err => {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", (req, res) => {
        db.Note
            .create(req.body)
            .then(dbNote => {
                // Once we've created the note in our notes collection, we run another query using mongoose's promise based queries to update the current article with the new note's ID
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        notes: dbNote._id
                    }
                }, {
                    new: true
                });
            }).then(dbArt => {
                // If the User was updated successfully, send it back to the client
                res.json(dbArt);
            })
            .catch(err => {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    });

// This route updates the article to remove it from the saved articles list by updating the isSaved property.
    app.put("/article/:id", (req, res) => {
        const articleId = req.params.id;
        db.Article.update({
                _id: articleId
            }, {
                $set: {
                    isSaved: false
                }
            })
            .then(dbArt => {
                res.json(dbArt);
            }).catch(err => {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    });

// This route deletes a note based on it's parent article and by it's ID
    app.delete("/notes/:id/:articleId", (req, res) => {
        const noteId = req.params.id;
        const articleId = req.params.articleId;
        db.Article.update({
                _id: articleId
            }, {
                $pull: {
                    notes: noteId
                }
            })
            .then(dbArt => {
                return db.Note.findByIdAndRemove({
                    _id: noteId
                }).then(removed => {
                    res.json(removed);
                }).catch(err => {
                    // If an error occurs, send it back to the client
                    res.json(err);
                });
            });
    });
};
