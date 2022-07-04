const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const gameflow = require('./game_logic')

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

    // socket.on('joinCode', (clientCode) => {
    //     if(clientCode !== code){
    //         socket.disconnect(true);
    //         console.log("Connection closed");
    //     }
    // });

    socket.on('ready', () => {
        gameflow.start();
    })

    socket.broadcast.emit('gameCode', code);
});


app.use(express.static(path.join(__dirname, 'Client')));

server.listen(9000, () => { //Port server listen on
    console.log("Listening on 9000");
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

function getPlayers(){
    return players;
}

module.exports = { getPlayers };