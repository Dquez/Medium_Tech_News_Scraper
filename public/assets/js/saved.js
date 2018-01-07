
// Whenever someone clicks a p tag
$(document).on("click", ".addNote", function () {
    // Empty the notes from the note section
    // $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
      // With that done, add the note information to the page
      .done(function (data) {
        console.log(data);
        // // The title of the article
        // $("#notes").append("<h2>" + data.title + "</h2>");
        // // An input to enter a new title
        // $("#notes").append("<input id='titleinput' name='title' >");
        // // A textarea to add a new note body
        // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // // A button to submit a new note, with the id of the article saved to it
        // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // // If there's a note in the article
        // if (data.note) {
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.note.body);
        // }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", ".save-note", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log($(this).siblings(".bodyinput").val());
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from note textarea
          message: $(this).siblings(".bodyinput").val()
        }
      })
      // With that done
      .done(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        // $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    $(this).siblings(".bodyinput").val("");
  });

  $(".modal-trigger").click(function(e){
    e.preventDefault();
    dataModal = $(this).attr("data-modal");
    $("#" + dataModal).css({"display":"block"});
  });
  
  $(".close-modal, .modal-sandbox").click(function(){
    $(".modal").css({"display":"none"});
  });

        // // console.log(data.length);
        // let modal = $("#saved-notes");
        // $(modal).css("display", "block");
        // // the results paramater was passed in the callback function from when we scraped Medium
        // $("#article-length").text(results.length);
        // $(".close").on("click", function () {
        //   $(modal).css("display", "none");
        // });
        // window.onclick = function (event) {
        //   if (event.target !== modal) {
        //     $(modal).css("display", "none");
        //     window.location.replace("/");
        //   }
        // }
        