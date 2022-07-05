var audio = new Audio("Richard Wagner - Ride of The Valkyries.mp3");
audio.pause();
$("#playButton").click(function () {
  if (audio.paused) {
    audio.play();
    startPitchDetection();
  } else {
    audio.pause();
  }
});
