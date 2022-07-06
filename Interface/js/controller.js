// const socket = new io("http://localhost:9000", {});
const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});
var readyButton = document.getElementById("readyButton");
var readyState = document.getElementById("state");
var joinCode = document.querySelector("#joinCode");
var userName = document.querySelector("#userName");
var uName = document.getElementById("uName");
var jCode = document.getElementById("jCode");
var userReady = false;
var output;
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

// $("#readyButton").click(function () {
//   console.log("ready button pressed");
//   if (userName.value == "" || joinCode.value == "") {
//     alert("Please fill in all fields");
//   } else {
//     if (!userReady) {
//       userReady = true;
//       readyState.innerHTML = "Ready!";
//       readyButton.innerHTML = "Not Ready";
//       output = userName.value;
//       uName.innerHTML = output;
//       output = joinCode.value;
//       jCode.innerHTML = output;
//       socket.emit("User", userName.value);
//       socket.emit("joinCode", joinCode.value);
//       sessionStorage.setItem("userName", userName.value);
//     } else {
//       userReady = false;
//       uName.innerHTML = "";
//       jCode.innerHTML = "";
//       userName.value = "";
//       joinCode.value = "";
//       readyState.innerHTML = "Not ready";
//       readyButton.innerHTML = "Ready";
//     }
//   }
// });

function ready() {
  console.log("ready button pressed");
  if (userName.value == "" || joinCode.value == "") {
    alert("Please fill in all fields");
  } else {
    if (!userReady) {
      userReady = true;
      readyState.innerHTML = "Ready!";
      readyButton.innerHTML = "Not Ready";
      output = userName.value;
      uName.innerHTML = output;
      output = joinCode.value;
      jCode.innerHTML = output;
      socket.emit("User", userName.value);
      socket.emit("joinCode", joinCode.value);
      sessionStorage.setItem("userName", userName.value);
    } else {
      userReady = false;
      uName.innerHTML = "";
      jCode.innerHTML = "";
      userName.value = "";
      joinCode.value = "";
      readyState.innerHTML = "Not ready";
      readyButton.innerHTML = "Ready";
    }
  }
}

// function alertFunc() {
//   let acl = new Accelerometer({ frequency: 60 });
//   acl.addEventListener("reading", () => {
//     console.log("Acceleration along the X-axis " + acl.x);
//     console.log("Acceleration along the Y-axis " + acl.y);
//     console.log("Acceleration along the Z-axis " + acl.z);

//     alert(
//       "Acceleration along the X-axis " +
//         acl.x +
//         ", Y-axis: " +
//         acl.y +
//         ", Z-axis: " +
//         acl.z
//     );
//   });
//   acl.start();
// }

//setInterval(alertFunc(), 10000); //for some reason, still constant, unstoppable updates...

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

socket.on("updateSensitivity", (songSensitivity) => {
  if (songSensitivity == 0.2) {
    // slow
    upper_threshold = 0;
  } else if (songSensitivity == 1) {
    // normal
    upper_threshold = 10;
  } else if (songSensitivity == 1.2) {
    // fast
    upper_threshold = 20;
  }

  // TODO: check that song sensitivity makes sense for thresholds
});

function addPlayer(userName) {
  const node = document.createElement("li");
  const textnode = document.createTextNode(userName);
  node.appendChild(textnode);
  document.getElementById("playerList").appendChild(node);
}

socket.on("gameStarted", (players) => {
  //will start users' accelerometer
  console.log("start game");
  window.location.href = "./playerScreen.html";

  for (let i = 0; i < players.length; i++) {
    sessionStorage.setItem(i + 1, players[i].id);
  }
  //start accelerometer
});

socket.on("restartGame", () => {
  alert("Game was restarted by host");
  window.location.href = "./controller.html";
});

function updateReadings() {
  let acl = new LinearAccelerationSensor({ frequency: 60 });
  acl.addEventListener("reading", () => {
    //console.log("Acceleration along the X-axis " + acl.x);
    xOutput.innerHTML = acl.x.toFixed(2);
    yOutput.innerHTML = acl.y.toFixed(2);
    zOutput.innerHTML = acl.z.toFixed(2);

    sensorAccelerationMagnitude = Math.sqrt(
      acl.x * acl.x + acl.y * acl.y + acl.z * acl.z
    );

    normOutput.innerHTML = sensorAccelerationMagnitude.toFixed(2);

    // console.log("Acceleration along the Y-axis " + acl.y);
    // console.log("Acceleration along the Z-axis " + acl.z);

    // alert(
    //   "Acceleration along the X-axis " +
    //     acl.x +
    //     ", Y-axis: " +
    //     acl.y +
    //     ", Z-axis: " +
    //     acl.z
    // );
  });
  acl.start();
  return sensorAccelerationMagnitude;
}

function alert_disqualify(acc_magnitude) {
  if (acc_magnitude >= upper_threshold || acc_magnitude > hard_cap || dqFlag) {
    // disqualify the player:
    // alert("Disqualified");
    // tell player that player is disqualified by making their screen red
    // document.body.style.background = "red";
    document.body.style.background = "red";
    dqFlag = true;

    // tell server that player is disqualifyed
    socket.emit("disqualifyPlayer", sessionStorage.getItem("userName"));

    //alert(sessionStorage.getItem("userName") + " was disqualified");

    //on server:
    //sort board
    //grey them out on the scoreboard
  } else if (acc_magnitude >= upper_threshold * 0.9) {
    //alert user that they are close to threshold by making their screen orange
    updateState.innerHTML = "Close";
    document.body.style.background = "orange";
  } else if (acc_magnitude >= upper_threshold * 0.75) {
    updateState.innerHTML = "Approaching";
    //alert user that they are approaching the threshold by making their screen yellow
    document.body.style.background = "yellow";
  } else {
    //ie: if acc_magnitude<upper_threshold*0.75 && acc_magnitude>lower_threshold
    //make their screen green
    updateState.innerHTML = "Safe " + acc_magnitude.toFixed(2);

    document.body.style.background = "green";
  }
}

//setInterval(updateReadings(), 500);
// setInterval(alert_disqualify(), 500);

function getAccel() {
  console.log("permissions button pressed");
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("devicemotion", (event) => {
            // do something with event
            xOutput.innerHTML = event.acceleration.x.toFixed(2);
            yOutput.innerHTML = event.acceleration.y.toFixed(2);
            zOutput.innerHTML = event.acceleration.z.toFixed(2);
            updateState.innerHTML = "Started motion sensing";

            acc_magnitude = Math.sqrt(
              event.acceleration.x * event.acceleration.x +
                event.acceleration.y * event.acceleration.y +
                event.acceleration.z * event.acceleration.z
            );

            //process magnitude

            normOutput.innerHTML = Math.sqrt(
              event.acceleration.x * event.acceleration.x +
                event.acceleration.y * event.acceleration.y +
                event.acceleration.z * event.acceleration.z
            ).toFixed(2);
            alert_disqualify(acc_magnitude);
          });
        }
      })
      .catch(console.error);
    alert_disqualify(acc_magnitude);
  } else {
    // alert_disqualify(updateReadings())
    // non iOS 13+
    updateReadings();
    console.log("alter_disqualify");
    lacl = new LinearAccelerationSensor({ frequency: 60 });
    lacl.addEventListener("reading", () => {
      acc_magnitude = Math.sqrt(
        lacl.x * lacl.x + lacl.y * lacl.y + lacl.z * lacl.z
      );
      // alert("Acceleration along the X-axis " + acl.x + ", Y-axis: " + acl.y + ", Z-axis: " + acl.z);
      alert_disqualify(acc_magnitude);
    });
    lacl.start();
  }
}

setInterval(getAccel(), 500);

DeviceMotionEvent.requestPermission().then((response) => {
  if (response == "granted") {
    console.log("accelerometer permission granted");
    // Do stuff here
  }
});

function changeToBlue() {
  document.body.style.background = "blue";
}

function changeToPink() {
  document.body.style.background = "pink";
}

function changeToRed() {
  document.body.style.background = "red";
}

setInterval(function () {
  updateMag.innerHTML = acc_magnitude.toFixed(2);
  console.log(acc_magnitude);
  normOutput.innerHTML = acc_magnitude.toFixed(2);
}, 100);

//must visually indicate that the player was eliminated
socket.on("disqualifyPlayer", (userName) => {
  strikeThrough(userName);
});
