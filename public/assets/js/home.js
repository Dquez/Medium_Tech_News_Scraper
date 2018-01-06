$("#scrape").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function (results) {
    // Grab the articles as a json
    $.ajax({
      method: "GET",
      url: "/"
    }).done(function (data) {
      // console.log(data.length);
      let modal = $("#myModal");
      $(modal).css("display", "block");
      // the results paramater was passed in the callback function from when we scraped Medium
      $("#article-length").text(results.length);
      $(".close").on("click", function () {
        $(modal).css("display", "none");
      });
      window.onclick = function (event) {
        if (event.target !== modal) {
          $(modal).css("display", "none");
          window.location.replace("/");
        }
      }
      
    });
  })
})

$(document).on("click", ".saveArticle", function () {
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/save-article/" + thisId
  }).done(function (data) {
    // console.log(data);
  });
});

$("#saved").on("click", function () {

  $.ajax({
    method: "GET",
    url: "/saved-articles"
  }).done(function (data) {
    // $("#articles").empty();
    console.log(data);
    if(data){
      window.location.replace("/saved-articles");
    }
    else {
      alert("You have no saved articles");
    }
 
    // for (let i = 0; i < data.length; i++) {
    //   // Display the apropos information on the page
    //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].summary + "<br />" + data[i].url + "</p><button data-id='" + data[i]._id + "' class='saveArticle'>SAVE ARTICLE</button>");
    // }
  });
});

