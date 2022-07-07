// const socket = new io("http://localhost:9000", {});
// const socket = new io("https://jack-joust.herokuapp.com/", {});

const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});
var readyButton = document.getElementById("readyButton");
var readyState = document.getElementById("state");
var joinCode = document.querySelector("#joinCode");
var userName = document.querySelector("#userName");
var uName = document.getElementById("uName");
var jCode = document.getElementById("jCode");
var userReady = false;
// var output;
var xOutput = document.getElementById("xRead");
var yOutput = document.getElementById("yRead");
var zOutput = document.getElementById("zRead");
var normOutput = document.getElementById("norm");

var sensorAccelerationMagnitude = 0;

var iOSSensorAccelerationMagnitude = 0;
var iOSAccMagnitude = 0;

var acc_magnitude = 0;
let lacl = new LinearAccelerationSensor({ frequency: 60 });
var lower_threshold = 0;
var upper_threshold = 30;
var hard_cap = 50;

var updateState = document.getElementById("updateState");
var updateMag = document.getElementById("updateMag");

var dqFlag = false;

function ready() {
  console.log("ready button pressed");
  if (userName.value == "" || joinCode.value == "") {
    alert("Please fill in all fields");
  } else {
    if (!userReady) {
      userReady = true;
      readyState.innerHTML = "Ready!";
      //readyButton.innerHTML = "Not Ready";
      output = userName.value;
      uName.innerHTML = output;
      output = joinCode.value;
      jCode.innerHTML = output;
      socket.emit("userJoin", userName.value, joinCode.value);
      //socket.emit("joinCode", joinCode.value);
      sessionStorage.setItem("userName", userName.value);
    }
  }
}

socket.on("invalidCode", () => {
  alert("Client: invalid code");
  console.log("Client: invalid code");
  userReady = false;
  jCode.innerHTML = "";
  joinCode.value = "";
  readyState.innerHTML = "Not ready";
  readyButton.innerHTML = "Ready";
});

socket.on("validCode", () => {
  alert("Client: Code was accepted");
  console.log("Client: Code was accepted");
});

socket.on("takenName", (msg) => {
  alert(msg);
  userReady = false;
  jCode.innerHTML = "";
  joinCode.value = "";
  readyState.innerHTML = "Not ready";
  readyButton.innerHTML = "Ready";
  console.log("accepted username");
});

function strikeThrough(userName) {
  socket.emit("controllerLog: " + "strike");
  let nodes = Array.from($("#playerList").children("li"));
  for (let count = 0; count < nodes.length; count++) {
    const element = nodes[count];
    console.log(nodes[count].innerHTML);
    if (element.innerHTML == userName) {
      element.innerHTML = element.innerHTML.strike();
      break;
    }
  }
}

function addPlayer(userName) {
  const node = document.createElement("li");
  const textnode = document.createTextNode(userName);
  node.appendChild(textnode);
  document.getElementById("playerList").appendChild(node);
}

socket.on("gameStarted", () => {
  //will start users' accelerometer
  console.log("start game");
  //sessionStorage.setItem("Playing", true);
  window.location = "https://damp-gorge-23211.herokuapp.com/playerScreen.html";
  //start accelerometer
});

//must visually indicate that the player was eliminated
socket.on("strikePlayer", (userName) => {
  socket.emit("controllerLog", "controller strike " + userName);
  console.log("controller: strike");
  this.strikeThrough(userName);
});

//must visually indicate that the player was eliminated
socket.on("disqualifyPlayer", (userName) => {
  socket.emit("controllerLog", "controller disqualifyPlayer");
  console.log("controller: strike");
  strikeThrough(userName);
});

socket.on("Won", (winner) => {
  console.log("Won");
  if (sessionStorage.getItem("userName") === winner) {
    alert("Winner Winner JackScript Dinner");
    $("#winImage").fadeIn(1000);
  }
});
