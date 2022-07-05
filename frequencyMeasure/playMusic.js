var audio = new Audio("Richard Wagner - Ride of The Valkyries.mp3");
audio.play();
$("#playButton").click(function () {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});
