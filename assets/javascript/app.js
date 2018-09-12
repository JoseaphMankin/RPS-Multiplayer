$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAmtWU0JuUHWYTWR1MeE2eb0X6zn5vuOvs",
        authDomain: "rps-multiplayer-deab7.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-deab7.firebaseio.com",
        projectId: "rps-multiplayer-deab7",
        storageBucket: "rps-multiplayer-deab7.appspot.com",
        messagingSenderId: "825187295627"
    };
    firebase.initializeApp(config);

    let userScore = 0;
    let computerScore = 0;
    let userGuess = "";
    let computerGuess = "";
    let leftPlayer = "";
    let rightPlayer = "";

    const leftRock = "assets/images/rock.png";
    const leftPaper = "assets/images/paper.png";
    const leftScissors = "assets/images/scissors.png";
    const rightRock = "assets/images/rockRight.png";
    const rightPaper = "assets/images/paperRight.png";
    const rightScissors = "assets/images/scissorsRight.png";

    $(".main").toggle();

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
            localStorage.setItem("leftWins", userScore);
            $(".userScore").text(userScore);
        } else if (userGuess === "rock" && computerGuess === "paper") {
            $(".pickLeft").attr("src", leftRock);
            $(".pickRight").attr("src", rightPaper);
            $(".result").text("Rock is Covered By Paper. You Lose!!");
            computerScore++;
            localStorage.setItem("rightWins", computerScore);
            $(".computerScore").text(computerScore);
        } else if (userGuess === "paper" && computerGuess === "rock") {
            $(".pickLeft").attr("src", leftPaper);
            $(".pickRight").attr("src", rightRock);
            $(".result").text("Paper Covers Rock. You Win!!");
            userScore++;
            localStorage.setItem("leftWins", userScore);
            $(".userScore").text(userScore);
        } else if (userGuess === "paper" && computerGuess === "scissors") {
            $(".pickLeft").attr("src", leftPaper);
            $(".pickRight").attr("src", rightScissors);
            $(".result").text("Paper is Cut By Scissors. You Lose!!");
            computerScore++;
            localStorage.setItem("rightWins", computerScore);
            $(".computerScore").text(computerScore);
        } else if (userGuess === "scissors" && computerGuess === "paper") {
            $(".pickLeft").attr("src", leftScissors);
            $(".pickRight").attr("src", rightPaper);
            $(".result").text("Scissors Cuts Paper. You Win!!");
            userScore++;
            localStorage.setItem("leftWins", userScore);
            $(".userScore").text(userScore);
        } else if (userGuess === "scissors" && computerGuess === "rock") {
            $(".pickLeft").attr("src", leftScissors);
            $(".pickRight").attr("src", rightRock);
            $(".result").text("Scissors is Smashed By Rock. You Lose!!");
            computerScore++;
            localStorage.setItem("rightWins", computerScore);
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
        statUpdate();
    });

    function getComputerChoice() {
        const choices = ["rock", "paper", "scissors"];
        let randomNumber = Math.floor(Math.random() * 3);
        computerGuess = choices[randomNumber];
    }

//login screen
$(".add-user-btn").on("click", function (event) {
    event.preventDefault();
    let user = $(".user-input").val();
    $(".existingUsers").append(`
        <button class='btn btn-success mr-2 user-btn' data-user='${user}'>
            ${user}
        </button>
    `)
});

$(document).on("click", ".user-btn", function () {
    leftPlayer = $(this).attr("data-user");
    $(".main").show();
    $(".logIn").hide();
    $(".user-label").text(leftPlayer);
    $(".userStatName").text(leftPlayer + "'s");
    $(".battleLeft").text(leftPlayer);
});

//localStorage tinkering

function statUpdate(){
    let leftWins = localStorage.getItem("leftWins");
    let rightWins = localStorage.getItem("rightWins");
    let totalWins = Number(leftWins) + Number(rightWins);
    console.log(totalWins);

    $(".leftWins").text("Wins: " + leftWins);
    $(".rightWins").text("Wins: " + rightWins);
    $(".leftLosses").text("Losses: " + rightWins);
    $(".rightLosses").text("Losses: " + leftWins);

    $(".leftWinPer").text("Total Win %: " + Math.floor(leftWins/totalWins * 100)) + "%";
    $(".rightWinPer").text("Total Win %: " + Math.floor(rightWins/totalWins * 100)) + "%";
}

//Firebase tinkerings

   $(".clearButton").on("click", function(){
      
       console.log("WORKING STILL!!");
       localStorage.setItem("leftWins", 0);
       localStorage.setItem("rightWins", 0);
        // writeUserData(1, "Joe", 23, 6)
   });

   function writeUserData(userId, name, wins, losses) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      totalwins: wins,
      totallosses : losses
    });
  }

});