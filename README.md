# Medium_Tech_News_Scraper

![Medium Tech News Scraper](https://media.giphy.com/media/1yTgkr0z0GjPLbTjsO/giphy.gif)

## Overview

In this project, I created app that allows you to scrape [Medium](https://medium.com/) This app is a full-stack app which performs multiple functions on the back end, including routing the user based on the url endpoint they request, utilizing a Mongoose ORM to query the Mongo database, and sending the data back to the user using a custom API and ajax calls.This app interacts with the databse using all the CRUD methods.


## Inspiration
I read Medium tech news everyday on my way to work. Sometimes instead of waiting for the daily email notification, I want to just glance at what's in the spotlight. Now I can with my [Medium Tech News Scraper](https://medium-tech-scraper.herokuapp.com/). I have a reliable way of getting all my articles both on mobile or desktop in seconds. I can even write notes to go along with the specific article. If a friend writes a note on the same article, I can see what their thoughts are about it too!


## How I built it

I primarily worked with node.js, handlebars, and the express frame work to handle routing, connecting to the server and sending files to the front end. On the front end, I used html, javascript, jQuery and CSS and Semantic ui styling framework.
There is still room for improvement including adding more pages for different websites to scrape and some interactivity with clicking buttons. I included the following packages:
* [express](https://www.npmjs.com/package/express)
* [bodyParser](https://www.npmjs.com/package/body-parser)
* [express-handlebars](https://www.npmjs.com/package/express-handlebars)
* [nodemon](https://www.npmjs.com/package/nodemon)
* [cheerio](https://www.npmjs.com/package/cheerio)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [request](https://www.npmjs.com/package/request)

Running an npm install should install all of the dependencies you need to get this project started.

## What I learned
This app helped me understand better how to traverse the DOM, not only for getting input from the user but traversing a separate webpage than my own creations. I was able to better understand how different collections are associated within a database, which helped simplify the proccess of keeping all my data in one place.

[Medium-tech-scraper](https://medium-tech-scraper.herokuapp.com/)
