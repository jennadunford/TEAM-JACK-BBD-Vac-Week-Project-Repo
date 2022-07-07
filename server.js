const express = require('express');
var device = require('express-device');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
// const gameflow = require('./game_logic');

const port = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);

const io = socketio(server);
var userBool;
let code = genCode(4);

let players = [];
let playerCount = 0;
let playing = false;

io.on('connection', (socket) => { //Evertything with socket
    console.log('Client connected');
    socket.on('userJoin', (user, clientCode) => {
        if(clientCode.toUpperCase() !== code){
            console.log('User tried to join with an invalid code or username taken');
            socket.emit('invalidCode', 'Please use the correct join code');
        }else if(checkUsername(user)){
            console.log('Username taken');
            socket.emit('takenName', 'Username taken. Please change it.');
        }else{
            console.log('User joined');
            players[playerCount++] = {
                "id": user,
                "playing": true,
                "score": 0
            }

            socket.emit('validCode', 'Joined');
            socket.broadcast.emit('userJoined', players[playerCount-1].id);
            
        }
        
        console.log(players);
        // if(playerCount == 1){
            
        // }
        // console.log(players[playerCount-1].id)
        // console.log(players);
    });

    // socket.on('joinCode', (clientCode) => {
    //     if(clientCode.toUpperCase() !== code){
    //         console.log('User tried to join with an invalid code');
    //         socket.emit('invalidCode', 'Please use the correct join code');
    //     }else{
    //         console.log('User joined');
    //         socket.emit('validCode', 'Joined');
    //         socket.broadcast.emit('userJoined', players[playerCount-1].id);
    //     }
    // });

    socket.on('ready', () => {
        playing = true;
        startGame();
        console.log('start game')
        socket.broadcast.emit('gameStarted');
    })

    if(playing){
        socket.emit('playerList', players);
    }

    socket.on('restart', () => {
        playing = false;
        console.log('restart game')
        socket.broadcast.emit('restartGame');

        players = [];
        playerCount = 0;
    })

    socket.on('generateCode', () => {
        code = genCode(4);
        socket.emit('gameCode', code);
    })
    
    socket.on('disqualifyPlayer', (userName)=>{ //Disable the player's playing attribute
        //find player
        var playerIndex = findPlayer(userName)
        if (!(playerIndex==-1)){
            playerCount--;
            let removed = players.splice(playerIndex, 1);
            if(playerCount == 1){
                //game should stop
                console.log(players);
                // socket.broadcast.emit('playerOut', userName);
                socket.broadcast.emit('gameOver', players);
                let winSocket = players[0].id;
                io.emit('Won', winSocket);
                playing = false;
            }else{
                io.emit('playerOut', userName);
            }
            
            console.log(userName + ' disqualified');
            // socket.broadcast.emit('strikePlayer', (userName));
            // socket.local.emit('strikePlayer', (userName));
            // io.emit('strikePlayer', (userName));
        }else{
            console.log("Player not found");
        }
    })

    socket.on('songSensitivity', (sense) => { //Get song sense from musicplayer
        if(playing){
            socket.broadcast.emit('updateSensitivity', sense);     
            //console.log('sensitivity updated');       
        }
    });

    socket.on('playersLeft', ()=>{
        // console.log('server: players left')
        socket.emit('numPlayers', playerCount);
    });

    socket.on('controllerLog', (msg)=>{
        console.log('From controller: ' + msg);
    });
});

app.use(express.static(path.join(__dirname, 'Interface')));

server.listen(port, () => { //Port server listen on
    console.log("Listening on " + port);
    console.log(code);
});

function checkUsername(thisUsername)
{
    for(var i = 0; i < playerCount; i++)
    {
        if(players[i].id == thisUsername)
        {
            return true;
        }
    }
    return false;
}


//MUSIC FROM HERE ---------------------------------------------------------------------------------
// var audio;
//GAME FLOW FROM HERE -----------------------------------------------------------------------------

function genCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}

function findPlayer(player){
    //return indexx of player in gamestate.playerlist
    for (let k=0;k<gamestate.leaderboard.length;k++){
        if (player==gamestate.leaderboard[k].id){
            return k;
        }
    }
    return -1;
}

var gamestate = {
    leaderboard:"",
    currentSong:"",
    sensitivity:"",
    currentRound:"",
    timeRemaining:""
};

// returns index of player that was sent into the function and returns -1 for a player that is sent in with invalid ID

// function sortLeaderboard(playerList){
//     //sorts players according to score
//     let numPlayers = playerList.length;
//     for (let out=0;out<numPlayers;out++){
//         for (let inner = out+1; inner<numPlayers; inner++){
//             if (playerList[inner].score<playerList[outer].score){
//                 var temp = playerList[inner];
//                 playerList[inner] = playerList[outer];
//                 playerList[outer] = temp
//             }
//         }
//     }
// }

// function resetRound(){
//     gamestate.rounds++
//     for (k=0;k<gamestate.leaderboard.length;k++){
//         gamestate.leaderboard[k].playing=true;
//     }
// }

// returns time remaining of the current round
// function getTimeRemaining(){
//     return 100;
// }

// function getUserSensitityLevel(accReading){
//     // let normalisedValue = (accReading.x + accReading.y + accReading.z)/3
//     // if (normalisedValue < 1){
//     //     return 1;
//     // } else if (normalisedValue < 2){
//     //     return 2
//     // } else if (normalisedValue < 3){
//     //     return 3;
//     // }
// }

function startGame(){
    numOfPlayers = players.length;
    gamestate.leaderboard = players;
    gamestate.rounds = 0;
    gamestate.timeRemaining = 60;
    gamestate.gameover = false;
    // var audio = new Audio("Richard Wagner - Ride of The Valkyries.mp3");
    // audio.play();
    // startPitchDetection();
    //broadcast starting sensitivity
}

// function getSongSensitivity(){
//     return 0;
// }

// function handlePlayerRequest(player){
//     // game play logic
//     //check if round is over
//     if(getRoundOver()){ // get remaining time from server
//         for(let i = 0; i < gamestate.leaderboard.length; i++){
//             if(gamestate.leaderboard[i].playing){
//                 gamestate.leaderboard[i].score++;
//             }
//         }
//         resetRound();
//         if(gamestate.rounds > maxRounds){
//             gamestate.gameover = true;
//             // sortLeaderboard(gamestate.leaderboard)
//             //broadcast gameover
//         }
//     }else{
//         if(player.playing){
//             let userSensLevel = getUserSensitityLevel(player.accReading) //work out their senslevel
//             if(userSensLevel > gamestate.sensitivity){
//                 gamestate.leaderboard[findPlayer(player.id)].playing = false;
//                 numOfPlayers--;
//                 //tell player they're out -> red screen?
//             }

//             if(numOfPlayers == 1){
//                 gamestate.leaderboard[findPlayer(player.id)].score += 1;
//                 resetRound();
//                 //front should display scoreboard
//             }
//             // sortLeaderboard(gamestate.leaderboard)
//         }
//     }

//     // if(getTimeRemaining() < 10){ // 10 seconds left
//     //     gamestate.sensitivity += 3;
//     // } else if(getTimeRemaining() < 20){
//     //     gamestate.sensitivity += 2;
//     // } else if(getTimeRemaining() < 30){
//     //     gamestate.sensitivity += 1;
//     // }
//     //broadcast gamestate
//     socket.broadcast.emit('updateGameState', gamestate);
// }
