$(document).ready(function () {

    let userScore = 0;
    let computerScore = 0;
    let userGuess = "";
    let computerGuess = "";

    const leftRock = "assets/images/rock.png";
    const leftPaper = "assets/images/paper.png";
    const leftScissors = "assets/images/scissors.png";
    const rightRock = "assets/images/rockRight.png";
    const rightPaper = "assets/images/paperRight.png";
    const rightScissors = "assets/images/scissorsRight.png";



    $(".choice").on("click", function () {
        userGuess = $(this).attr("data-type");
        getComputerChoice();
        console.log("Your Guess: " + userGuess);
        console.log("Comp Guess: " + computerGuess);

        if (userGuess === "rock" && computerGuess === "scissors") {
            $(".pickLeft").attr("src", leftRock);
            $(".pickRight").attr("src", rightScissors);
            $(".result").text("Rock Breaks Scissors. You Win!!");
            userScore++;
            $(".userScore").text(userScore);
        } else if (userGuess === "rock" && computerGuess === "paper") {
            $(".pickLeft").attr("src", leftRock);
            $(".pickRight").attr("src", rightPaper);
            $(".result").text("Rock is Covered By Paper. You Lose!!");
            computerScore++;
            $(".computerScore").text(computerScore);
        } else if (userGuess === "paper" && computerGuess === "rock") {
            $(".pickLeft").attr("src", leftPaper);
            $(".pickRight").attr("src", rightRock);
            $(".result").text("Paper Covers Rock. You Win!!");
            userScore++;
            $(".userScore").text(userScore);
        } else if (userGuess === "paper" && computerGuess === "scissors") {
            $(".pickLeft").attr("src", leftPaper);
            $(".pickRight").attr("src", rightScissors);
            $(".result").text("Paper is Cut By Scissors. You Lose!!");
            computerScore++;
            $(".computerScore").text(computerScore);
        } else if (userGuess === "scissors" && computerGuess === "paper") {
            $(".pickLeft").attr("src", leftScissors);
            $(".pickRight").attr("src", rightPaper);
            $(".result").text("Scissors Cuts Paper. You Win!!");
            userScore++;
            $(".userScore").text(userScore);
        } else if (userGuess === "scissors" && computerGuess === "rock") {
            $(".pickLeft").attr("src", leftScissors);
            $(".pickRight").attr("src", rightRock);
            $(".result").text("Scissors is Smashed By Rock. You Lose!!");
            computerScore++;
            $(".computerScore").text(computerScore);
        } else if (userGuess === "rock" && computerGuess === "rock") {
            $(".pickLeft").attr("src", leftRock);
            $(".pickRight").attr("src", rightRock);
            $(".result").text("It's A Draw. Shoot Again!!");
        } else if (userGuess === "paper" && computerGuess === "paper") {
            $(".pickLeft").attr("src", leftPaper);
            $(".pickRight").attr("src", rightPaper);
            $(".result").text("It's A Draw. Shoot Again!!");
        } else {
            $(".pickLeft").attr("src", leftScissors);
            $(".pickRight").attr("src", rightScissors);
            $(".result").text("It's A Draw. Shoot Again!!");
        }
    });

    function getComputerChoice() {
        const choices = ["rock", "paper", "scissors"];
        let randomNumber = Math.floor(Math.random() * 3);
        computerGuess = choices[randomNumber];
    }

    $(".front").on("click", function () {
        $(".card").flip('toggle');
    });

});