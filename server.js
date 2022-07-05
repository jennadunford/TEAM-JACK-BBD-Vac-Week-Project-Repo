const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
// const gameflow = require('./game_logic');

const port = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let code = genCode(4);

let players = [];
let playerCount = 0;

io.on('connection', (socket) => { //Evertything with socket
    console.log('Client connected');

    socket.on('User', (user) => {
        players[playerCount++] = {
            id: user,
            playing: true,
            score: 0,
            acceleration: 0
        }

        console.log(players);
    });

    socket.on('joinCode', (clientCode) => {
        if(clientCode !== code){
            socket.disconnect(true);
            console.log("Client tried with invalid code.");
        }
    });

    socket.on('ready', () => {
        startGame();
    })

    socket.broadcast.emit('gameCode', code);
});


app.use(express.static(path.join(__dirname, 'Client')));

server.listen(port, () => { //Port server listen on
    console.log("Listening on " + port);
    console.log(code);
});

function genCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}

var gamestate = {
    leaderboard:"",
    currentSong:"",
    sensitivity:"",
    currentRound:"",
    timeRemaining:""
};

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

function resetRound(){
    gamestate.rounds++
    for (k=0;k<gamestate.leaderboard.length;k++){
        gamestate.leaderboard[k].playing=true;
    }
}

// returns time remaining of the current round
function getTimeRemaining(){
    return 100;
}

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

function startGame(){
    numOfPlayers = players.length;
    gamestate.leaderboard = players;
    gamestate.sensitivityLevel = getSongSensitivity(); // get song song sensitivity from server
    gamestate.rounds = 0;
    gamestate.timeRemaining = 60;
    gamestate.gameover = false;
    //broadcast starting sensitivity
}

function getSongSensitivity(){
    return 0;
}

function handlePlayerRequest(player){
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
                //tell player they're out -> red screen?
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