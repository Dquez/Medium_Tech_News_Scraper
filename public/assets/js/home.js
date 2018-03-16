$("#scrape").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(results => {
    // Grab the articles as a json
    $.ajax({
      method: "GET",
      url: "/"
    }).done(data => {
      const modal = $("#myModal");
      $(modal).css("display", "block");
      // the results paramater was passed in the callback function from when we scraped Medium
      $("#article-length").text(results.length);
      $(".close").on("click", () => {
        $(modal).css("display", "none");
      });
      window.onclick = event => {
        if (event.target !== modal) {
          $(modal).css("display", "none");

          window.location.replace("/");
        }
      }
    });
  });
});

// Takes out the headline content once the articles have been populated
if ($("#articles").children().length > 1){
  $("#headline").empty();
}

$(document).on("click", ".saveArticle", function () {
  $(this).addClass("loading");
  const removeClass = () => {
    $(this).removeClass("loading");
  }
  removeClass.bind(this);

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/save-article/" + thisId
  }).done(data => {
    // this function sets the illusion that it takes time to save the article, otherwise the button would just be clicked and nothing would actually be visible to the user
    setTimeout(removeClass, 1000)
  });
});

$("#saved").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/saved-articles"
  }).done(function (data) {
    if(data){
      window.location.replace("/saved-articles");
    }
    else {
      alert("You have no saved articles");
    }
  });
});

