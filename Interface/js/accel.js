// const socket = new io("http://localhost:9000", {});
// const socket = new io("https://jack-joust.herokuapp.com/", {});

const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});
// var readyButton = document.getElementById("readyButton");
// var readyState = document.getElementById("state");
// var joinCode = document.querySelector("#joinCode");
// var userName = document.querySelector("#userName");
// var uName = document.getElementById("uName");
// var jCode = document.getElementById("jCode");
// var userReady = false;
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
var upper_threshold = 10;
var hard_cap = 50;

// var updateState = document.getElementById("updateState");
// var updateMag = document.getElementById("updateMag");

var dqFlag = false;
let custAcc = 0;

socket.on("updateSensitivity", (songSensitivity) => {
  //Get song sense from server
  if (songSensitivity == 0.8) {
    // slow
    // console.log("lower");
    upper_threshold = 3;
  } else if (songSensitivity == 1) {
    // normal
    // console.log("normal");
    upper_threshold = 15;
  } else if (songSensitivity == 1.2) {
    // fast
    // console.log("fast");
    upper_threshold = 25;
  }
});

socket.on("playerList", (players) => {
  //Get playerlist from server and add to playscreen
  //Add playerlist
  for (let i = 0; i < players.length; i++) {
    addPlayer(players[i].id);
  }
});

socket.on("restartGame", () => {
  //Game stoped by host
  sessionStorage.clear();
  alert("Game was stoped by host");
  window.location.href = "./controller.html";
});

socket.on('Won', (winner) => {
  console.log('Won');
  if(sessionStorage.getItem('userName') === winner){
    alert('Winner Winner JackScript Dinner');
    $("#winImage").fadeIn(1000);
  }
})

function updateReadings() {
  let acl = new LinearAccelerationSensor({ frequency: 60 });
  acl.addEventListener("reading", () => {
    //console.log("Acceleration along the X-axis " + acl.x);
    xOutput.innerHTML = acl.x.toFixed(2);
    yOutput.innerHTML = acl.y.toFixed(2);
    zOutput.innerHTML = acl.z.toFixed(2);

    //       sensorAccelerationMagnitude = Math.sqrt(
    //         acl.x * acl.x + acl.y * acl.y + acl.z * acl.z
    //       );

    normOutput.innerHTML = sensorAccelerationMagnitude.toFixed(2);
  });
  acl.start();
  return sensorAccelerationMagnitude;
}

function alert_disqualify(acc_magnitude) {
  // acc_magnitude = document.getElementById("customAcc").value;
  // socket.emit('controllerLog', 'test: ' + acc_magnitude);
  // console.log("before:" + acc_magnitude);
  // acc_magnitude = getAccel();
  // socket.emit('controllerLog', 'after' + acc_magnitude);
  // console.log("after" + acc_magnitude);
  // console.log("T:" + upper_threshold);
  if (dqFlag) {
    document.body.style.background = "red";
  } else if (acc_magnitude >= upper_threshold || acc_magnitude > hard_cap) {
    // disqualify the player:
    // alert("Disqualified");
    // tell player that player is disqualified by making their screen red
    document.body.style.background = "red";
    dqFlag = true;

    // tell server that player is disqualifyed
    socket.emit("disqualifyPlayer", sessionStorage.getItem("userName"));
    //on server:
    //sort board
    //grey them out on the scoreboard
    return;
  } else if (acc_magnitude >= (upper_threshold * 2) / 3) {
    //alert user that they are close to threshold by making their screen orange
    //updateState.innerHTML = "Close";
    document.body.style.background = "orange";
    return;
  } else if (acc_magnitude >= (upper_threshold * 1) / 6) {
    //updateState.innerHTML = "Far";
    //alert user that they are approaching the threshold by making their screen yellow
    document.body.style.background = "yellow";
    return;
  } else {
    //ie: if acc_magnitude<upper_threshold*0.75 && acc_magnitude>lower_threshold
    //make their screen green
    //updateState.innerHTML = "Safe " + acc_magnitude.toFixed(2);

    document.body.style.background = "green";
    return;
  }
}

//setInterval(updateReadings(), 500);
// setInterval(alert_disqualify(), 500);

function getAccel() {
  //   //console.log("permissions button pressed");
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("devicemotion", (event) => {
            // do something with event
            xOutput.innerHTML = event.acceleration.x.toFixed(2);
            yOutput.innerHTML = event.acceleration.y.toFixed(2);
            zOutput.innerHTML = event.acceleration.z.toFixed(2);
            // updateState.innerHTML = "Started motion sensing";

            acc_magnitude = Math.sqrt(
              Math.abs(
                event.acceleration.x * event.acceleration.x +
                  event.acceleration.y * event.acceleration.y +
                  event.acceleration.z * event.acceleration.z
              )
            );

            //process magnitude

            normOutput.innerHTML = Math.sqrt(
              Math.abs(
                event.acceleration.x * event.acceleration.x +
                  event.acceleration.y * event.acceleration.y +
                  event.acceleration.z * event.acceleration.z
              )
            ).toFixed(2);

            // return (acc_magnitude);
            alert_disqualify(acc_magnitude);
          });
        }
      })
      .catch(console.error);
    //return (acc_magnitude);
    alert_disqualify(acc_magnitude);
  } else {
    // alert_disqualify(updateReadings())
    // non iOS 13+
    updateReadings();
    console.log("alter_disqualify");
    lacl = new LinearAccelerationSensor({ frequency: 60 });
    lacl.addEventListener("reading", () => {
      acc_magnitude = Math.sqrt(
        Math.abs(lacl.x * lacl.x + lacl.y * lacl.y + lacl.z * lacl.z)
      );
      // alert("Acceleration along the X-axis " + acl.x + ", Y-axis: " + acl.y + ", Z-axis: " + acl.z);
      //return (acc_magnitude);
      alert_disqualify(acc_magnitude);
    });
    lacl.start();
  }
}

// function setAcc(){
//   custAcc = document.getElementById("customAcc").value;
//   console.log("Acc set to " + custAcc);
// }

setInterval(() => {
  getAccel();
}, 500);

// DeviceMotionEvent.requestPermission().then((response) => {
//   if (response == "granted") {
//     console.log("accelerometer permission granted");
//     // Do stuff here
//   }

// });

//must visually indicate that the player was eliminated
socket.on("playerOut", (userName) => {
  socket.emit("controllerLog", "controller disqualifyPlayer");
  console.log("controller: strike");
  strikeThrough(userName);
});
