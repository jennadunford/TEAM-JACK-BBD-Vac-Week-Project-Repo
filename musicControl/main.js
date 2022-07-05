var audio = new Audio("RideOfTheValkyries.mp3");

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

    playButton.innerHTML = "Pause";
  } else {
    audio.pause();
    speedCheck.classList.add("hidden");
    playButton.innerHTML = "Play";
  }
});

function switchSong(songID) {
  change = true;
  audio.pause();
  speedCheck.classList.add("hidden");
  playButton.innerHTML = "Play";
  switch (songID) {
    case "song1":
      audio = new Audio("RideOfTheValkyries.mp3");
      showSong.innerHTML = "Ride of the Valkyries";
      audio.pause();
      break;
    case "song2":
      audio = new Audio("BrandenburgConcertoNo11.mp3");
      showSong.innerHTML = "Brandenburg Concerto No. 11";
      audio.pause();
      break;
    case "song3":
      audio = new Audio("CoconutMallMarioKart.mp3");
      showSong.innerHTML = "Mario Kart Coconut Mall";
      audio.pause();
      break;
    case "song4":
      audio = new Audio("NeverGonnaGiveYouUp.mp3");
      showSong.innerHTML = "The Best Song You've Ever Heard";
      audio.pause();
      break;
    case "song5":
      audio = new Audio("TheFieldsofArdSkellig.mp3");
      showSong.innerHTML = "The Fields of Ard Skellig";
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
    console.log("Random number generated: " + num);
    switch (num) {
      case 1:
        audio.playbackRate = 1;
        speedCheck.innerHTML = "Playing at normal speed";
        moveBox.innerHTML = "AT REGULAR SPEED!";
        break;
      case 2:
        audio.playbackRate = 5;
        speedCheck.innerHTML = "Playing 5 times faster";
        moveBox.innerHTML = "FAST!";
        break;
      case 3:
        audio.playbackRate = 0.2;
        speedCheck.innerHTML = "Playing 0.2 times slower";
        moveBox.innerHTML = "SLOWLY!";
        break;
    }
  }, 5000); //5 seconds
}

$("#reload").click(function () {
  location.reload();
});
