// Whenever someone clicks a p tag
$(document).on("click", ".addNote", function () {
    // Empty the notes from the note section
    $("#notes").empty();
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
            data.forEach(function (note) {
                $("#notes").append(`<p>${note.message}</p><button class='delNote' data-id='${note._id}'>X</button>`);
            });
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
    console.log(articleId)
    // console.log($(this).siblings(".bodyinput").val());
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

    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    $(this).siblings(".bodyinput").val("");
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