$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAmtWU0JuUHWYTWR1MeE2eb0X6zn5vuOvs",
        authDomain: "rps-multiplayer-deab7.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-deab7.firebaseio.com",
        projectId: "rps-multiplayer-deab7",
        storageBucket: "rps-multiplayer-deab7.appspot.com",
        messagingSenderId: "825187295627"
      };
      firebase.initializeApp(config);

    //initial global varibles   
    var database = firebase.database();
    let userScore = 0;
    let computerScore = 0;

    let leftScore = 0;
    let rightScore = 0;
    let userGuess = "";
    let computerGuess = "";

    let leftPlayer = "Compy";
    let rightPlayer = "Compy";
    let isLeftActive = false;
    let isPlayingComputer = true;

    //Firebase Variables (JOE: These might actually replace some of the above)
    // let playerData = "";
    // let playerName = "";
    // let playerWins = 0;
    // let playerLosses = 0;
    // let playerTotalGames = 0;
    // let playerWinPer = Math.floor((playerWins / playerTotalGames) * 100);

    //CONSTs for all the hand images
    const leftRock = "assets/images/rock.png";
    const leftPaper = "assets/images/paper.png";
    const leftScissors = "assets/images/scissors.png";
    const rightRock = "assets/images/rockRight.png";
    const rightPaper = "assets/images/paperRight.png";
    const rightScissors = "assets/images/scissorsRight.png";


    //Main Game Div screen starts out hidden during login
    $(".main").toggle();
    $(".logInControls").toggle();
   
    $(".playComputer").on("click", function () {
        isplayingComputer = true;
        $(".logInControls").toggle();
        $(".computerAsk").toggle();
    });

    $(".playUser").on("click", function () {
        isplayingComputer = false;
        $(".logInControls").toggle();
        $(".computerAsk").toggle();
    });

    //LOGIN SCREEN----------------------------------------------------
    //Dynamic Creation of User Buttons if they already exist in the "users" Firebase

    database.ref("users").on("value", function (snapshot) {
        console.log(snapshot.val());

        snapshot.forEach((child) => {
            console.log(child.val().playerName);
            let user = child.val().playerName;
            $(".existingUsers").append(`
                <button class='btn btn-warning mr-2 user-btn' data-user='${user}'>
                    ${user}
                </button>
            `)
        });
    });

    //Dynamic Creation of a a new User button: 
    $(".add-user-btn").on("click", function (event) {
        event.preventDefault();
        let user = $(".user-input").val().trim();
        $(".existingUsers").append(`
        <button class='btn btn-success mr-2 user-btn' data-user='${user}'>
            ${user} 
        </button>
        `)
    });

    //Chosing your player, Updating firebase & local, Starting game by unhiding Main Game Div
    $(document).on("click", ".user-btn", function (event) {
        event.preventDefault();

        if (isLeftActive === false) {
            // Get the input values
            leftPlayer = $(this).attr("data-user");

            //MAYBE THIS NEEDS TO NOT BE A LISTENER - SAT CLASS Comparison to see if this is a New User or an Existing One
            database.ref().on("child_added", function (snapshot) {

                let sv = snapshot.val();

                if (leftPlayer == snapshot.val().playerName) {
                    leftPlayer = snapshot.val().playerName;
                    leftWins = parseInt(snapshot.val().playerWins);
                    console.log("It's a Match")
                } else {
                    database.ref(`/users/${leftPlayer}`).set({
                        playerName: leftPlayer,
                        playerWins: 0,
                        playerLosses: 0
                    }).then(user => {
                        console.log(user);
                    }).catch(error => {
                        console.log(error)
                    })
                }

                //update all the labels
                $(".left-label").text(leftPlayer);
                $(".leftStatName").text(leftPlayer + "'s");
                $(".battleLeft").text(leftPlayer);
                $(".leftWins").text("Wins: " + leftScore);

                //Hide the Login Screen and Load the Game Page
                $(".logIn").hide();
                $("#rightHands").hide();
                $(".main").show();

            });
        } else {
            // Get the input values
            rightPlayer = $(this).attr("data-user");

            //comparison to see if this is a New User or an Existing One
            database.ref().on("value", function (snapshot) {

                if (rightPlayer == snapshot.val().playerName) {
                    rightPlayer = snapshot.val().playerName;
                    rightWins = parseInt(snapshot.val().playerWins);
                    console.log("It's a Match")
                } else {
                    database.ref(`/users/${rightPlayer}`).set({
                        playerName: rightPlayer,
                        playerWins: 0,
                        playerLosses: 0
                    }).then(user => {
                        console.log(user);
                    }).catch(error => {
                        console.log(error)
                    })
                }

                //update all the labels
                $(".right-label").text(rightPlayer);
                $(".rightStatName").text(rightPlayer + "'s");
                $(".battleRight").text(rightPlayer);
                $(".rightWins").text("Wins: " + rightScore);

                //Hide the Login Screen and Load the Game Page
                $(".logIn").hide();
                $("#leftHands").hide();
                $(".main").show();

            });
        }
    });


    //Main Game Logic. If/Else could likely be DRYed up. 

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
            database.ref("mainScoreboard").set({
                userScore: userScore,
                computerScore: computerScore
            });
            database.ref(`/users/${leftPlayer}`).push({
                playerWins: playerWins + userScore
            })

        } else if (userGuess === "rock" && computerGuess === "paper") {
            $(".pickLeft").attr("src", leftRock);
            $(".pickRight").attr("src", rightPaper);
            $(".result").text("Rock is Covered By Paper. You Lose!!");
            computerScore++;
            database.ref("mainScoreboard").set({
                userScore: userScore,
                computerScore: computerScore
            });
            $(".computerScore").text(computerScore);
        } else if (userGuess === "paper" && computerGuess === "rock") {
            $(".pickLeft").attr("src", leftPaper);
            $(".pickRight").attr("src", rightRock);
            $(".result").text("Paper Covers Rock. You Win!!");
            userScore++;
            database.ref("mainScoreboard").set({
                userScore: userScore,
                computerScore: computerScore
            });
            database.ref(`/users/${leftPlayer}`).push({
                playerWins: playerWins + userScore
            })
        } else if (userGuess === "paper" && computerGuess === "scissors") {
            $(".pickLeft").attr("src", leftPaper);
            $(".pickRight").attr("src", rightScissors);
            $(".result").text("Paper is Cut By Scissors. You Lose!!");
            computerScore++;
            database.ref("mainScoreboard").set({
                userScore: userScore,
                computerScore: computerScore
            });
        } else if (userGuess === "scissors" && computerGuess === "paper") {
            $(".pickLeft").attr("src", leftScissors);
            $(".pickRight").attr("src", rightPaper);
            $(".result").text("Scissors Cuts Paper. You Win!!");
            userScore++;
            database.ref("mainScoreboard").set({
                userScore: userScore,
                computerScore: computerScore
            });
            database.ref(`/users/${leftPlayer}`).push({
                playerWins: playerWins + userScore
            })
        } else if (userGuess === "scissors" && computerGuess === "rock") {
            $(".pickLeft").attr("src", leftScissors);
            $(".pickRight").attr("src", rightRock);
            $(".result").text("Scissors is Smashed By Rock. You Lose!!");
            computerScore++;
            database.ref("mainScoreboard").set({
                userScore: userScore,
                computerScore: computerScore
            });
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

    //Function for Computer picking their choice. (Random of 3 options)

    function getComputerChoice() {
        const choices = ["rock", "paper", "scissors"];
        let randomNumber = Math.floor(Math.random() * 3);
        computerGuess = choices[randomNumber];
    }


    //Firebase listener for updating and DOM updating. 
    database.ref("mainScoreboard").on("value", function (snapshot) {
        $(".userScore").text(userScore);
        $(".computerScore").text(computerScore);
        console.log(leftPlayer, rightPlayer)

        // If Firebase has a player, wins and losses stored (first case)
        //     if (snapshot.child("playerName").exists() && snapshot.child("playerWins").exists()) {

        //         // Set the local variables for highBidder equal to the stored values in firebase.
        //         playerData = snapshot.val().playerData;
        //         playerWins = parseInt(snapshot.val().playerWins);
        //         playerLosses = parseInt(snapshot.val().playerLosses);

        //         // change the HTML to reflect the newly updated local values (most recent information from firebase)
        //         $(".leftStatName").text(snapshot.val().playerData);
        //         $(".leftWins").text("Wins: " + snapshot.val().playerWins);
        //         $(".leftLosses").text("Losses: " + snapshot.val().playerLosses);
        //         $(".leftWinPer").text(("Total Win %: " + Math.floor((playerWins / playerTotalGames) * 100)) + "%");
        //         // Print the local data to the console.
        //         console.log(snapshot.val().playerData);
        //         console.log(snapshot.val().playerWins);
        //         console.log(snapshot.val().playerLosses);
        //     }

        //     // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
        //     else {

        //         // change the HTML to reflect the newly updated local values (most recent information from firebase)
        //         $(".leftStatName").text(playerData);
        //         $(".leftWins").text("Wins: " + playerWins);
        //         $(".leftLosses").text("Losses: " + playerLosses);
        //         // $(".leftWinPer").text(("Total Win %: " + Math.floor((playerWins / playerTotalGames * 100)) + "%");
        //         // Print the local data to the console.
        //         console.log(playerData);
        //         console.log(playerWins);
        //         console.log(playerLosses);
        //     }

        //     // If any errors are experienced, log them to console.
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code)

    });

    // BOILERPLATE FOR ONLINE PRESENCE. 
    // --------------------------------------------------------------
    // connectionsRef references a specific location in our database.
    // All of our connections will be stored in this directory.
    var connectionsRef = database.ref("/connections");

    // '.info/connected' is a special location provided by Firebase that is updated
    // every time the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snap) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#connected-viewers").text(snap.numChildren());
    });



});