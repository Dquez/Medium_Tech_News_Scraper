// Whenever someone clicks on the addNote button
$(document).on("click", ".addNote", function () {
   
    // Save the id from the button tag
    const thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .done(data => {
            data.forEach(note => {
                // This grabs the div with a data id equal to the article ID clicked and appends information to the specific notes div. Each addNote button opens up their own respective modal which is I traversed the DOM. Data coming in from using handlebars made this client-side manipulation of modals difficult
                $("div").data("id", thisId).children("#notes").append(`<p>${note.message}</p><button class='negative ui button delNote' data-id='${note._id}'>X</button>`);
            });    
        });
});

// When you click the savenote button
$(document).on("click", ".save-note", function () {
    // this prevents the user from submitting a blank note
    if ($(this).parents(".buttons").siblings(".bodyinput").val().length < 1) {
        return;
    }
    // This adds a little loading animation to enhance the UX
    $(this).addClass("loading");
    const removeClass = () => {
      $(".bodyinput").val("");
      $(this).removeClass("loading");
    }
    // bind the current context of this to use later on to remove the class we just added
    removeClass.bind(this);
    
    // Grab the id associated with the article from the submit button
    const thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from note textarea
                message: $(this).parents(".buttons").siblings(".bodyinput").val()
            }
        })
        .done(data => {
            setTimeout(removeClass, 1000);
        });

    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    $(this).siblings(".bodyinput").val("");
});

// When you click the delete note button
$(document).on("click", ".delNote", function () {
    // Grab the id associated with the article from the submit button
    const thisId = $(this).data("id");
    const articleId = $(this).parents(".modal-body").data("id");
    // Run a DELETE request to change the note, using what's entered in the inputs
    $.ajax({
            method: "DELETE",
            url: "/notes/" + thisId + "/" + articleId
        })
        // With that done
        .done(function (data) {
            // Log the response
            console.log(data);
        });
        window.location.replace("/saved-articles");
    $(this).siblings(".bodyinput").val("");
});
// When you click the delete note button
$(document).on("click", ".removeSaved", function () {
    // Grab the id associated with the article from the submit button
    const thisId = $(this).data("id");
    // Run a PUT request to change the note using the article ID
    $.ajax({
            method: "PUT",
            url: "/article/" + thisId
        })
        // With that done
        .done(function (data) {
            // Log the response
            window.location.replace("/saved-articles");
        });
});

$(".modal-trigger").click(function (e) {
    e.preventDefault();
    dataModal = $(this).attr("data-modal");
    $("#" + dataModal).css({
        "display": "block"
    });
});

$(".close-modal, .modal-sandbox").click(function () {
    $(".modal").css({
        "display": "none"
    });
    $("div#notes").empty();
});