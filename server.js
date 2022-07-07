const express = require("express");
var device = require("express-device");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
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

io.on("connection", (socket) => {
  //Evertything with socket
  console.log("Client connected");
  socket.on("userJoin", (user, clientCode) => {
    if (clientCode.toUpperCase() !== code) {
      console.log("User tried to join with an invalid code or username taken");
      socket.emit("invalidCode", "Please use the correct join code");
    } else if (checkUsername(user)) {
      console.log("Username taken");
      socket.emit("takenName", "Username taken. Please change it.");
    } else {
      console.log("User joined");
      players[playerCount++] = {
        id: user,
        playing: true,
        score: 0,
      };

      socket.emit("validCode", "Joined");
      socket.broadcast.emit("userJoined", players[playerCount - 1].id);
    }

    console.log(players);
  });

  socket.on("ready", () => {
    playing = true;
    startGame();
    console.log("start game");
    socket.broadcast.emit("gameStarted");
  });

  if (playing) {
    socket.emit("playerList", players);
  }

  socket.on("restart", () => {
    playing = false;
    console.log("restart game");
    socket.broadcast.emit("restartGame");

    players = [];
    playerCount = 0;
  });

  socket.on("generateCode", () => {
    code = genCode(4);
    socket.emit("gameCode", code);
  });

  socket.on("disqualifyPlayer", (userName) => {
    //Disable the player's playing attribute
    //find player
    var playerIndex = findPlayer(userName);
    if (!(playerIndex == -1)) {
      playerCount--;
      let removed = players.splice(playerIndex, 1);
      if (playerCount == 1) {
        //game should stop
        console.log(players);
        socket.broadcast.emit("playerOut", userName);
        socket.broadcast.emit("gameOver", players);
        playing = false;
      } else {
        socket.broadcast.emit("playerOut", userName);
      }

      console.log(userName + " disqualified");
    } else {
      console.log("Player not found");
    }
  });

  socket.on("songSensitivity", (sense) => {
    if (playing) {
      socket.broadcast.emit("updateSensitivity", sense);
    }
  });

  socket.on("playersLeft", () => {
    socket.emit("numPlayers", playerCount);
  });

  socket.on("controllerLog", (msg) => {
    console.log("From controller: " + msg);
  });
});

app.use(express.static(path.join(__dirname, "Interface")));

server.listen(port, () => {
  //Port server listen on
  console.log("Listening on " + port);
  console.log(code);
});

function checkUsername(thisUsername) {
  for (var i = 0; i < playerCount; i++) {
    if (players[i].id == thisUsername) {
      return true;
    }
  }
  return false;
}

//GAME FLOW FROM HERE -----------------------------------------------------------------------------

function genCode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function findPlayer(player) {
  //return indexx of player in gamestate.playerlist
  for (let k = 0; k < gamestate.leaderboard.length; k++) {
    if (player == gamestate.leaderboard[k].id) {
      return k;
    }
  }
  return -1;
}

var gamestate = {
  leaderboard: "",
  currentSong: "",
  sensitivity: "",
  currentRound: "",
  timeRemaining: "",
};

function startGame() {
  numOfPlayers = players.length;
  gamestate.leaderboard = players;
  gamestate.rounds = 0;
  gamestate.timeRemaining = 60;
  gamestate.gameover = false;
}
