// var userName = document.querySelector("#userName");
const socket = new io("http://localhost:9000", {});
// console.log("computer ui");

// const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});
var musicfiles = ["Music Files/RideOfTheValkyries.mp3", "Music Files/BrandenburgConcertoNo11.mp3", "Music Files/CoconutMallMarioKart.mp3", "Music Files/NeverGonnaGiveYouUp.mp3", "Music Files/TheFieldsofArdSkellig.mp3", "Music Files/EpicSportClap.mp3", "Music Files/GroovyRock.mp3", "Music Files/Piano.mp3"]
var musicnames = ["Ride Of The Valkyries", "Brandenburg Concerto No.11", "Coconut Mall Mario Kart", "Never Gonna Give You Up", "The Fields of Ard Skellig", "Epic Sport Clap", "Groovy Rock", "Piano"]
var songSpeed = 1;

var joinCodeDisplay = document.getElementById("joinCode");
$("#generateButton").click(function () {
  console.log("asked for code");
  socket.emit("generateCode");
});

socket.on("gameCode", (code) => {
  console.log("generated code on computer: " + code);
  joinCodeDisplay.innerHTML = code;
});

//must visually indicate that the player was eliminated
socket.on("playerOut", (userName) => {
  // alert(userName + " is out");
  //strikeThrough(userName);
  showRemovedPlayer(userName);
});

function strikeThrough(userName) {
  let nodes = Array.from($("#playerList").children("li"));
  for (let count = 0; count < nodes.length; count++) {
    const element = nodes[count];
    console.log(nodes[count].innerHTML);
    if (element.innerHTML == userName) {
      element.innerHTML.strike();
      break;
    }
  }
}
$("#addPlayer").click(function () {
  if (userName.value == "") {
    alert("Please enter a username");
  } else {
    addPlayer(userName.value);
  }
});

function addPlayer(userName) {
  const node = document.createElement("li");
  const textnode = document.createTextNode(userName);
  node.appendChild(textnode);
  document.getElementById("playerList").appendChild(node);
}

$("#startButton").click(function () {
  $("#startGamePressed").fadeIn(500);
  $("#startGamePressed").fadeOut(500);
  socket.emit("ready");
  audio.play();
  changeSpeeds();
  checkTimeLeft();
  // window.location.href = "./gameScreen.html";
});

$("#restartButton").click(function () {
  alert("Game stopped");
  socket.emit("restart");
  audio.pause();
  //Clear player list needs to be added
  document.getElementById("playerList").innerHTML = "";
});

socket.on("userJoined", (user) => {
  console.log(user);
  addPlayer(user);
});

socket.on('numPlayers', (numPlayers) =>{
  // console.log('host: players left');
  if(numPlayers != 1){
    randomIndex = Math.floor(Math.random() * musicfiles.length)
    randomElement = musicfiles[randomIndex];
    audio = new Audio(randomElement);
    showSong.innerHTML = musicnames[randomIndex];
    audio.play();
  }
});

socket.on('gameOver', (players) => {
  showWinner(players[0].id);
  audio.pause();
});

$("#removePlayer").click(function () {
  removePlayer(userName.value);
});
function removePlayer(userName) {
  let nodes = Array.from($("#playerList").children("li"));
  for (let count = 0; count < nodes.length; count++) {
    const element = nodes[count];
    console.log(nodes[count].innerHTML);
    if (element.innerHTML == userName) {
      element.parentNode.removeChild(element);
      break;
    }
  }
}

// from music.js below

var audio = new Audio("Music Files/RideOfTheValkyries.mp3");

const speedCheck = document.getElementById("musicState");
var showSong = document.getElementById("showSong");

var change = false;

const playButton = document.getElementById("playButton");
const moveBox = document.getElementById("howMove");

changeSpeeds();

audio.pause();
$("#playButton").click(function () {
  if (audio.paused) {
    audio.play();
    speedCheck.classList.remove("hidden");
    moveBox.classList.remove("hidden");
    playButton.innerHTML = "Pause";
  } else {
    audio.pause();
    speedCheck.classList.add("hidden");
    moveBox.classList.add("hidden");
    playButton.innerHTML = "Play";
  }
});

function switchSong(songID) {
  change = true;
  audio.pause();
  speedCheck.classList.add("hidden");
  moveBox.classList.remove("hidden");
  playButton.innerHTML = "Play";
  switch (songID) {
    case "song1":
      audio = new Audio("Music Files/RideOfTheValkyries.mp3");
      showSong.innerHTML = "Ride of the Valkyries";
      audio.pause();
      break;
    case "song2":
      audio = new Audio("Music Files/BrandenburgConcertoNo11.mp3");
      showSong.innerHTML = "Brandenburg Concerto No. 11";
      audio.pause();
      break;
    case "song3":
      audio = new Audio("Music Files/CoconutMallMarioKart.mp3");
      showSong.innerHTML = "Mario Kart Coconut Mall";
      audio.pause();
      break;
    case "song4":
      audio = new Audio("Music Files/NeverGonnaGiveYouUp.mp3");
      showSong.innerHTML = "The Best Song You've Ever Heard";
      audio.pause();
      break;
    case "song5":
      audio = new Audio("Music Files/TheFieldsofArdSkellig.mp3");
      showSong.innerHTML = "The Fields of Ard Skellig";
      audio.pause();
      break;
    case "song6":
      audio = new Audio("Music Files/Piano.mp3");
      showSong.innerHTML = "Piano";
      audio.pause();
      break;
    case "song7":
      audio = new Audio("Music Files/EpicSportClap.mp3");
      showSong.innerHTML = "EpicSportClap";
      audio.pause();
      break;
    case "song8":
      audio = new Audio("Music Files/GroovyRock.mp3");
      showSong.innerHTML = "GroovyRock";
      audio.pause();
      break;
  }
}

$(".dropdown-menu a").on("click", function () {
  var getID = $(this).attr("id");
  switchSong(getID);
});

function changeSpeeds() {
  setInterval(() => {
    var num = Math.floor(Math.random() * 3) + 1;
    //console.log("Random number generated: " + num);
    switch (num) {
      case 1:
        songSpeed = 1;
        audio.playbackRate = songSpeed;
        speedCheck.innerHTML = "Playing at normal speed";
        moveBox.innerHTML = "AT REGULAR SPEED!";
        socket.emit("songSensitivity", songSpeed);
        break;
      case 2:
        songSpeed = 1.2;
        audio.playbackRate = songSpeed;
        speedCheck.innerHTML = "Playing 1.2 times faster";
        moveBox.innerHTML = "FAST!";
        socket.emit("songSensitivity", songSpeed);
        break;
      case 3:
        songSpeed = 0.8;
        audio.playbackRate = songSpeed;
        speedCheck.innerHTML = "Playing 0.8 times slower";
        moveBox.innerHTML = "SLOWLY!";
        socket.emit("songSensitivity", songSpeed);
        break;
    }
  }, 5000); //5 seconds
}

$("#reload").click(function () {
  location.reload();
});

function showRemovedPlayer(userName) {
  var loseMessage = document.getElementById("loseMessage");
  loseMessage.innerHTML = userName + " IS OUT THE GAME";
  $("#loseMessage").fadeIn(600);
  $("#loseMessage").fadeOut(2000);
}

function showWinner(userName){
  var winMessage = document.getElementById("winMessage");
  winMessage.style.display = "block";
  winMessage.innerHTML = userName + " WON THE GAME";
  $("#loseMessage").fadeIn(1000);
}

function checkTimeLeft() {
  setInterval(() => {
    if(audio.duration - audio.currentTime < 2/songSpeed){
      console.log('asking for players');
      socket.emit('playersLeft');
    }
  }, 800); //0.8 second checks slightly faster than the fastest playback speed
}
