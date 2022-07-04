var wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "black",
  interact: false,
  cursorWidth: 0,
  plugins: [WaveSurfer.microphone.create()],
});

wavesurfer.microphone.on("deviceReady", function (stream) {
  console.log("Device ready!", stream);
});

wavesurfer.microphone.on("deviceError", function (code) {
  console.warn("Device error: " + code);
});

// start the microphone
wavesurfer.microphone.start();

var speedValueBox = document.getElementById("speed");

// wavesurfer.on("volume", function () {
//   speedValueBox.innerHTML = wavesurfer.getVolume();
// });

// pause rendering
//wavesurfer.microphone.pause();

// resume rendering
//wavesurfer.microphone.play();

// stop visualization and disconnect microphone
//wavesurfer.microphone.stopDevice();

// same as stopDevice() but also clears the wavesurfer canvas
//wavesurfer.microphone.stop();

// destroy the plugin
//wavesurfer.microphone.destroy();
