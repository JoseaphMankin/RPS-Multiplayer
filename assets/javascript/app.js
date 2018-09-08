$(document).ready(function () {

    let userScore = 0;
    let computerScore = 0;
    let userGuess = "";

    $(".choice").on("click", function () {
        userGuess = $(this).attr("data-type");
        console.log(userGuess);
    });


});