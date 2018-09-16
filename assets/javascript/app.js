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

    let leftComboWins = 0;
    let rightComboWins = 0;
    let leftComboLosses = 0;
    let rightComboLosses = 0;

    let userGuess = "";
    let computerGuess = "";

    let leftPlayer = "Compy";
    let rightPlayer = "Compy";
    let isLeftActive = false;
    let isPlayingComputer = false;

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
        isLeftActive = false;
        isPlayingComputer = true;
        database.ref("/isLeftActive").set(false);
        database.ref("/whoIsPlaying/rightPlayer/").set({
            rightPlayer: "Compy",
            rightWins: 0,
            rightLosses: 0
        })
        $(".logInControls").toggle();
        $(".computerAsk").toggle();
    });

    $(".playUser").on("click", function () {
        isPlayingComputer = false;
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

        let leftTest = database.ref("isLeftActive").once("value", function (snapshot) {
            return snapshot.val()
        }).then(leftTest => {

            if (leftTest.val() === false) {
                // Get the input values
                leftPlayer = $(this).attr("data-user");

                database.ref("/isLeftActive").set(true);


                //MAYBE THIS NEEDS TO NOT BE A LISTENER - SAT CLASS Comparison to see if this is a New User or an Existing One
                database.ref("/users/" + leftPlayer).once("value", function (snapshot) {

                    // Call your function to check if they are a first time user (aka exists).
                    // checkForFirstTime(leftPlayer);

                    if (snapshot.val() !== null) {
                        leftPlayer = snapshot.val().playerName;
                        leftWins = parseInt(snapshot.val().playerWins);
                        leftLosses = parseInt(snapshot.val().playerLosses);
                        leftComboWins = parseInt(snapshot.val().playerWins);
                        leftComboLosses = parseInt(snapshot.val().playerLosses);
                        console.log("It's a Match")
                    } else {
                        console.log("New Peeps")
                        database.ref(`/users/${leftPlayer}`).set({
                            playerName: leftPlayer,
                            playerWins: 0,
                            playerLosses: 0
                            // }).then(user => {
                            //     console.log(user);
                        }).catch(error => {
                            console.log(error)
                        })
                    }

                    database.ref("/whoIsPlaying/leftPlayer").set({
                        leftPlayer: leftPlayer,
                        leftWins: leftWins,
                        leftLosses: leftLosses
                    })

                    //Hide the Login Screen and Load the Game Page
                    $(".logIn").hide();
                    $("#rightHands").hide();
                    $(".main").show();

                });
            } else {
                // Get the input values
                rightPlayer = $(this).attr("data-user");

                database.ref("/isLeftActive").set(false);

                //MAYBE THIS NEEDS TO NOT BE A LISTENER - SAT CLASS Comparison to see if this is a New User or an Existing One
                database.ref("/users/" + rightPlayer).once("value", function (snapshot) {

                    // Call your function to check if they are a first time user (aka exists).
                    // checkForFirstTime(leftPlayer);

                    if (snapshot.val() !== null) {
                        rightPlayer = snapshot.val().playerName;
                        rightWins = parseInt(snapshot.val().playerWins);
                        rightComboWins = parseInt(snapshot.val().playerWins);
                        rightComboLosses = parseInt(snapshot.val().playerLosses);
                        console.log("It's a Match")
                    } else {
                        console.log("New Peeps")
                        database.ref(`/users/${rightPlayer}`).set({
                            playerName: rightPlayer,
                            playerWins: 0,
                            playerLosses: 0
                            // }).then(user => {
                            //     console.log(user);
                        }).catch(error => {
                            console.log(error)
                        })
                    }

                    database.ref("/whoIsPlaying/rightPlayer").set({
                        rightPlayer: rightPlayer,
                        rightWins: rightWins
                    })

                    //Hide the Login Screen and Load the Game Page
                    $(".logIn").hide();
                    $("#leftHands").hide();
                    $(".main").show();

                });

            }


        });
    });


    //Main Game Logic. If/Else could likely be DRYed up. 

    $(".choice").on("click", function () {

        if (isPlayingComputer === true) {

            userGuess = $(this).attr("data-type");
            getComputerChoice();
            console.log("Your Guess: " + userGuess);
            console.log("Comp Guess: " + computerGuess);


            if (userGuess === "rock" && computerGuess === "scissors") {
                $(".pickLeft").attr("src", leftRock);
                $(".pickRight").attr("src", rightScissors);
                $(".result").text("Rock Breaks Scissors. You Win!!");
                userScore++;
                leftComboWins++;
                rightComboLosses++;
                database.ref("mainScoreboard").set({
                    userScore: userScore,
                    computerScore: computerScore
                });
                database.ref("/users/" + leftPlayer).update({
                    playerWins: leftComboWins
                })
                database.ref("/whoIsPlaying/leftPlayer/").update({
                    leftWins: userScore
                })
                database.ref("/whoIsPlaying/rightPlayer/").update({
                    rightLosses: userScore
                })

            } else if (userGuess === "rock" && computerGuess === "paper") {
                $(".pickLeft").attr("src", leftRock);
                $(".pickRight").attr("src", rightPaper);
                $(".result").text("Rock is Covered By Paper. You Lose!!");
                computerScore++;
                rightComboWins++;
                leftComboLosses++;
                database.ref("mainScoreboard").set({
                    userScore: userScore,
                    computerScore: computerScore
                });
                database.ref("/whoIsPlaying/rightPlayer/").update({
                    rightWins: computerScore
                })
                database.ref("/users/" + leftPlayer).update({
                    playerLosses: leftComboLosses
                })
                database.ref("/whoIsPlaying/leftPlayer/").update({
                    leftLosses: computerScore
                })
            } else if (userGuess === "paper" && computerGuess === "rock") {
                $(".pickLeft").attr("src", leftPaper);
                $(".pickRight").attr("src", rightRock);
                $(".result").text("Paper Covers Rock. You Win!!");
                userScore++;
                leftComboWins++;
                rightComboLosses++;
                database.ref("mainScoreboard").set({
                    userScore: userScore,
                    computerScore: computerScore
                });
                database.ref("/users/" + leftPlayer).update({
                    playerWins: leftComboWins
                })
                database.ref("/whoIsPlaying/leftPlayer/").update({
                    leftWins: userScore
                })
                database.ref("/whoIsPlaying/rightPlayer/").update({
                    rightLosses: userScore
                })
            } else if (userGuess === "paper" && computerGuess === "scissors") {
                $(".pickLeft").attr("src", leftPaper);
                $(".pickRight").attr("src", rightScissors);
                $(".result").text("Paper is Cut By Scissors. You Lose!!");
                computerScore++;
                rightComboWins++;
                leftComboLosses++;
                database.ref("mainScoreboard").set({
                    userScore: userScore,
                    computerScore: computerScore
                });
                database.ref("/whoIsPlaying/rightPlayer/").update({
                    rightWins: computerScore
                })
                database.ref("/users/" + leftPlayer).update({
                    playerLosses: leftComboLosses
                })
                database.ref("/whoIsPlaying/leftPlayer/").update({
                    leftLosses: computerScore
                })
            } else if (userGuess === "scissors" && computerGuess === "paper") {
                $(".pickLeft").attr("src", leftScissors);
                $(".pickRight").attr("src", rightPaper);
                $(".result").text("Scissors Cuts Paper. You Win!!");
                userScore++;
                leftComboWins++;
                rightComboLosses++;
                database.ref("mainScoreboard").set({
                    userScore: userScore,
                    computerScore: computerScore
                });
                database.ref("/users/" + leftPlayer).update({
                    playerWins: leftComboWins
                })
                database.ref("/whoIsPlaying/leftPlayer/").update({
                    leftWins: userScore
                })
                database.ref("/whoIsPlaying/rightPlayer/").update({
                    rightLosses: userScore
                })
            } else if (userGuess === "scissors" && computerGuess === "rock") {
                $(".pickLeft").attr("src", leftScissors);
                $(".pickRight").attr("src", rightRock);
                $(".result").text("Scissors is Smashed By Rock. You Lose!!");
                computerScore++;
                rightComboWins++;
                leftComboLosses++;
                database.ref("mainScoreboard").set({
                    userScore: userScore,
                    computerScore: computerScore
                });
                database.ref("/whoIsPlaying/rightPlayer/").update({
                    rightWins: computerScore
                })
                database.ref("/users/" + leftPlayer).update({
                    playerLosses: leftComboLosses
                })
                database.ref("/whoIsPlaying/leftPlayer/").update({
                    leftLosses: computerScore
                })
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
        } else {
            console.log("add some user logic")
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
        $(".leftWins").text()
        console.log(leftPlayer, rightPlayer)
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code)

    });

    database.ref("whoIsPlaying").on("value", function (snapshot) {
        console.log(snapshot.val());
        $(".left-label").text(snapshot.val().leftPlayer.leftPlayer);
        $(".leftStatName").text(snapshot.val().leftPlayer.leftPlayer + "'s");
        $(".battleLeft").text(snapshot.val().leftPlayer.leftPlayer);
        $(".leftWins").text("Wins: " + leftComboWins);
        $(".leftLosses").text("Losses: " + leftComboLosses);
        $(".leftWinPer").text("Win Ratio: " + Math.floor(leftComboWins/(leftComboWins + leftComboLosses) * 100) + "%")
        $(".right-label").text(snapshot.val().rightPlayer.rightPlayer);
        $(".rightStatName").text(snapshot.val().rightPlayer.rightPlayer + "'s");
        $(".battleRight").text(snapshot.val().rightPlayer.rightPlayer);
        $(".rightWins").text("Wins: " + rightComboWins);
        $(".rightLosses").text("Losses: " + rightComboLosses);
        $(".rightWinPer").text("Win Ratio: " + Math.floor(rightComboWins/(rightComboWins + rightComboLosses) * 100) + "%")
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