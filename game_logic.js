// The file that handles the game state during a round
// gamestate object:
// leaderboard
// currentSong
// sensitivity
// currentRound
// timeRemaining
// gameover

//server would have supplied users at this point. Will be a list of objects:
// var player = {
//     id = ,
//     score = 0,
//     playing = True,
//     acceleration = 0
// }

// playerList consists of all players in the game. a list/array of player variables
var playerList = {};

//hardcode for now, change once MVP is met
var maxRounds = 3;
var numOfPlayers = 0;

// state of current game. attributes described below:
    // leaderboard: sorted playerList. name is schanged for gamestate object. sorted in descending order
    // currentSong: path to which current song is. file path is:
    // sensitivity: sensitivity as determined from the tempo etc of the song being played rn
    // currentRound: current round, best of 3 atm
    // timeRemaining: time remaining of current round. as time goes on, sensitivity sensitivity threshold increases
//  
var gamestate = {
    leaderboard:"",
    currentSong:"",
    sensitivity:"",
    currentRound:"",
    timeRemaining:""
};

function sortLeaderboard(playerList){
    //sorts players according to score
    let numPlayers = playerList.length;
    for (let out=0;out<numPlayers;out++){
        for (let inner = out+1; inner<numPlayers; inner++){
            if (playerList[inner].score<playerList[outer].score){
                var temp = playerList[inner];
                playerList[inner] = playerList[outer];
                playerList[outer] = temp
            }
        }
    }
}

// returns index of player that was sent into the function and returns -1 for a player that is sent in with invalid ID
function findPlayer(player){
    //return indexx of player in gamestate.playerlist
    for (k=0;k<gamestate.leaderboard.length;k++){
        if (player.id==gamestate.leaderboard[k].id){
            return k;
        }
    }
    return -1;
}

function resetRound(){
    //make all players playing
    //round++
    gamestate.rounds++
    for (k=0;k<gamestate.leaderboard.length;k++){
        gamestate.leaderboard[k].playing=true;
    }
}

// returns time remaining of the current round
function getTimeRemaining(){
    return 100;
}

function playGame(player){
    // game play logic
    //check if round is over
    if(getRoundOver()){ // get remaining time from server
        for(let i = 0; i < gamestate.leaderboard.length; i++){
            if(gamestate.leaderboard[i].playing){
                gamestate.leaderboard[i].score++;
            }
        }
        resetRound();
        if(gamestate.rounds > maxRounds){
            gamestate.gameover = true;
            sortLeaderboard(gamestate.leaderboard)
            //broadcast gameover

        }
    }else{
        if(player.playing){
            let userSensLevel = getUserSensitityLevel(player.accReading) //work out their senslevel
            if(userSensLevel > gamestate.sensitivity){
                gamestate.leaderboard[findPlayer(player)].playing = false;
                numOfPlayers--;
                //tell player to get fucked
            }

            if(numOfPlayers == 1){
                gamestate.leaderboard[findPlayer(player)].score += 1;
                resetRound();
                                
                //front should display scoreboard
            }
            sortLeaderboard(gamestate.leaderboard)
        }
    }

    if(getTimeRemaining() < 10){ // 10 seconds left
        gamestate.sensitivity += 3;
    } else if(getTimeRemaining() < 20){
        gamestate.sensitivity += 2;
    } else if(getTimeRemaining() < 30){
        gamestate.sensitivity += 1;
    }
    //broadcast gamestate
}

//Maps an accelerometer reading to a sensitivity level so it can be compared to
//the sensitivity level of the music
//&Param: accReading: the users' accelerometer reading
//return: the sensitivity level (1-3)
function getUserSensitityLevel(accReading){
    let normalisedValue = (accReading.x + accReading.y + accReading.z)/3
    if (normalisedValue < 1){
        return 1;
    } else if (normalisedValue < 2){
        return 2
    } else if (normalisedValue < 3){
        return 3;
    }
}
    
function start(){
    playerList = getPlayers(); //get players from server
    numOfPlayers = playerList.length;
    // sortLeaderboard(playerList);
    gamestate.leaderboard = playerList;
    gamestate.sensitivityLevel = getSongSensitivity(); // get song song sensitivity from server
    gamestate.rounds = 0;
    gamestate.timeRemaining = 60;
    gamestate.gameover = false;
    //broadcast starting sensitivity
}