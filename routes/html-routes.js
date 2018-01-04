// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
const path = require("path");
const db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

    app.get("/", function (req, res) {
        db.Article
            .find({})
            .then(function (dbArt) {
                if (dbArt) {
                    let hbsObject = {
                        articles: dbArt
                    };
                res.render("home", hbsObject);
                } else {
                    res.render("home");
                }
            }).catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
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


    //   app.get("/about", function (req, res) {
    //     res.render("about-us");
    //   })

    //   // app.post("/register", function (req, res) {
    //   //   console.log(req.body);
    //   //   res.redirect("products");
    //   // });
    //   app.get("/register", function (req, res) {
    //     res.render("register");
    //   });


    //   app.get("/products", isAuthenticated, function (req, res) {
    //     res.render("products");
    //   });

};