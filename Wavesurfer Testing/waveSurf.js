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
/*
var audioContext = new window.AudioContext();
audioContext = wavesurfer.audioContext;
var audioCtx = new window.AudioContext(/*|| window.webkitAudioContext));
const analyser = audioCtx.createAnalyser();

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
const dataArray = new Uint8Array(bufferLength);

analyser.getByteFrequencyData(dataArray);
setInterval(function () {
  for (let index = 0; index < dataArray.length; index++) {
    const element = dataArray[index];
    console.log(element);
  }
}, 1000);*/

// setInterval(function () {
//   console.log(bufferLength);
//   //this code runs every second
// }, 1000);

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
