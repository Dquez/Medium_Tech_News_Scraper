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