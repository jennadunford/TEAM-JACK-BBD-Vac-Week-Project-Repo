// var wavesurfer = WaveSurfer.create({
//   container: "#waveform",
//   waveColor: "violet",
//   progressColor: "purple",
// });

// async function getMedia(constraints) {
//   let stream = null;
//   try {
//     stream = await navigator.mediaDevices.getUserMedia(constraints);
//     console.log(stream);
//   } catch (err) {
//     document.write(err);
//   }
// }

// getMedia({ audio: true, video: false });

// var hearingAudio = getMedia.audio;
// wavesurfer.load(getMedia.audio);

// wavesurfer.on("volume", function () {
//   wavesurfer.params.container.style.opacity = 0.9;
// });

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

wavesurfer.on("volume", function () {
  speedValueBox.innerHTML = wavesurfer.getVolume();
});

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
