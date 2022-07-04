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


function playGame(player){
    // game play logic
    //check if round is over
    //work out their senslevel
    //compare that to the song level in gamestate
    //update leaderboard if end or kicked


    //check if last player
    //check if last round
    // if not, increase round, reset all players, new song/sens
    //broadcast
    //update leaderboard

    //check time remaining
    //update sens accordingly
    //broadcast new sens
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
    sortLeaderboard(playerList);
    gamestate.leaderboard = playerList;
    gamestate.sensitivityLevel = getSongSensitivity(); // get song song sensitivity from server
    //start playing song
    //determine song sensitivity level
    //broadcast song sensitivity level
}