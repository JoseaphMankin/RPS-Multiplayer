$(document).ready(function () {

    let userScore = 0;
    let computerScore = 0;
    let userGuess = "";
    let computerGuess="";
    

    $(".choice").on("click", function () {
        userGuess = $(this).attr("data-type");
        getComputerChoice();
        console.log("Your Guess: " + userGuess);
        console.log("Comp Guess: " + computerGuess);

        if(userGuess === "rock" && computerGuess === "scissors"){
            console.log("You Win");
            userScore++;
            $(".userScore").text(userScore);
        } else if(userGuess === "rock" && computerGuess === "paper"){
            console.log("You Lose");
            computerScore++;
            $(".computerScore").text(computerScore);
        } else if(userGuess === "paper" && computerGuess === "rock"){
            console.log("You Win");
            userScore++;
            $(".userScore").text(userScore);
        } else if(userGuess === "paper" && computerGuess === "scissors"){
            console.log("You Lose");
            computerScore++;
            $(".computerScore").text(computerScore);
        } else if(userGuess === "scissors" && computerGuess === "paper"){
            console.log("You Win");
            userScore++;
            $(".userScore").text(userScore);
        } else if(userGuess === "scissors" && computerGuess === "rock"){
            console.log("You Lose");
            computerScore++;
            $(".computerScore").text(computerScore);
        } else {
                console.log("It's a Draw");
        }

    });

    function getComputerChoice(){
        const choices = ["rock", "paper", "scissors"];
        let randomNumber = Math.floor(Math.random()*3);
        computerGuess = choices[randomNumber];
    }


});