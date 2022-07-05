var output = 0;
var freq1Value = 0;
var freq2Value = 0;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let microphoneStream = null;
let analyserNode = audioCtx.createAnalyser();
let audioData = new Float32Array(analyserNode.fftSize);
let corrolatedSignal = new Float32Array(analyserNode.fftSize);
let localMaxima = new Array(10);
var maximaMean;
const audioElement = document.querySelector("audio");
const frequencyDisplayElement = document.querySelector("#frequency");
const changeInFrequencyDisplay = document.querySelector("#changeInFreq");
const track = audioCtx.createMediaElementSource(audioElement);

function startPitchDetection() {
  track.connect(audioCtx.destination);
  track.connect(analyserNode);

  audioData = new Float32Array(analyserNode.fftSize);
  corrolatedSignal = new Float32Array(analyserNode.fftSize);

  setInterval(() => {
    analyserNode.getFloatTimeDomainData(audioData);

    let pitch = getAutocorrolatedPitch();

    frequencyDisplayElement.innerHTML = `${pitch}`;
  }, 300);
}

function getAutocorrolatedPitch() {
  // First: autocorrolate the signal

  let maximaCount = 0;

  for (let l = 0; l < analyserNode.fftSize; l++) {
    corrolatedSignal[l] = 0;
    for (let i = 0; i < analyserNode.fftSize - l; i++) {
      corrolatedSignal[l] += audioData[i] * audioData[i + l];
    }
    if (l > 1) {
      if (
        corrolatedSignal[l - 2] - corrolatedSignal[l - 1] < 0 &&
        corrolatedSignal[l - 1] - corrolatedSignal[l] > 0
      ) {
        localMaxima[maximaCount] = l - 1;
        maximaCount++;
        if (maximaCount >= localMaxima.length) break;
      }
    }
  }

  // Second: find the average distance in samples between maxima

  maximaMean = localMaxima[0];

  for (let i = 1; i < maximaCount; i++)
    maximaMean += localMaxima[i] - localMaxima[i - 1];

  maximaMean /= maximaCount;
  // console.log(maximaMean);

  return audioCtx.sampleRate / maximaMean;
}

setInterval(() => {
  freq2Value = freq1Value;
  console.log("frequency 2 value: " + freq2Value);
  freq1Value = getAutocorrolatedPitch();
  console.log("Frequency 1 value: " + freq1Value);
  // ouput = freq2Value - freq1Value;
  console.log(freq2Value - freq1Value);
  changeInFrequencyDisplay.innerHTML = `${freq2Value - freq1Value}`; //Show change in frequency over 1 second
}, 1000);

const playButton = document.querySelector("button");
