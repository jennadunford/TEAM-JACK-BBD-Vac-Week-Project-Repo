// The file that handles the game state during a round
// gamestate object:
// leaderboard
// currentSong
// sensitivity
// currentRound
// timeRemaining

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

// state of current game. attributes described below:
    // leaderboard: sorted playerList. name is schanged for gamestate object. sorted in descending order
    // currentSong: path to which current song is. file path is:
    // sensitivity: sensitivity as determined from the tempo etc of the song being played rn
    // currentRound: current round, best of 3 atm
    // timeRemaining: time remaining of current round. as time goes on, sensitivity sensitivity threshold increases
//  
var gamestate = {
    leaderboard,
    currentSong,
    sensitivity,
    currentRound,
    timeRemaining
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

function getAcceleration(accReading){
    // gets the acceleration of each player from the accelerometer
}

function playGame(){
    // game play logic
}