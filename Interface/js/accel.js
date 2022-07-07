let custAcc = 0;

socket.on("updateSensitivity", (songSensitivity) => {
  //Get song sense from server
  if (songSensitivity == 0.8) {
    // slow
    // console.log("lower");
    upper_threshold = 8;
  } else if (songSensitivity == 1) {
    // normal
    // console.log("normal");
    upper_threshold = 20;
  } else if (songSensitivity == 1.2) {
    // fast
    // console.log("fast");
    upper_threshold = 30;
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

socket.on("playerOut", (userName) => {
  showRemovedPlayer(userName);
  strikeThrough(userName);
});

socket.on("Won", (winner) => {
  console.log("Won");
  if (sessionStorage.getItem("userName") === winner) {
    alert("Winner Winner JackScript Dinner");
    $("#winImage").fadeIn(1000);
  }
});

function strikeThrough(userName) {
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

function updateReadings() {
  let acl = new LinearAccelerationSensor({ frequency: 60 });
  acl.addEventListener("reading", () => {
    sensorAccelerationMagnitude = Math.sqrt(
      acl.x * acl.x + acl.y * acl.y + acl.z * acl.z
    );
  });
  acl.start();
  return sensorAccelerationMagnitude;
}

function getR(curr_acc) {
  return Math.min(255, (1530 / upper_threshold) * curr_acc);
}

function getG(curr_acc) {
  if (curr_acc <= (2 / 3) * upper_threshold) {
    return 255;
  } else if (curr_acc >= upper_threshold) {
    return 0;
  } else {
    return (-765 / upper_threshold) * curr_acc + 765;
  }
}

function getB(curr_acc) {
  return 0;
}

function alert_disqualify(acc_magnitude) {
  var r = getR(acc_magnitude);
  var g = getG(acc_magnitude);
  var b = getB(acc_magnitude);
  document.body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
  if (dqFlag) {
    document.body.style.background = "red";
  } else if (acc_magnitude >= upper_threshold || acc_magnitude > hard_cap) {
    dqFlag = true;

    // tell server that player is disqualifyed
    socket.emit("disqualifyPlayer", sessionStorage.getItem("userName"));
    //on server:
    //sort board
    //grey them out on the scoreboard
    return;
  } else if (acc_magnitude >= (upper_threshold * 2) / 3) {
    //alert user that they are close to threshold by making their screen orange
    updateState.innerHTML = "Close";
    // document.body.style.background = "orange";
    return;
  } else if (acc_magnitude >= (upper_threshold * 1) / 6) {
    updateState.innerHTML = "Far";
    //alert user that they are approaching the threshold by making their screen yellow
    // document.body.style.background = "yellow";
    return;
  } else {
    //ie: if acc_magnitude<upper_threshold*0.75 && acc_magnitude>lower_threshold
    //make their screen green
    updateState.innerHTML = "Safe " + acc_magnitude.toFixed(2);
    // document.body.style.background = "green";
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

      alert_disqualify(acc_magnitude);
    });
    lacl.start();
  }
}

setInterval(() => {
  getAccel();
}, 500);

//must visually indicate that the player was eliminated
socket.on("playerOut", (userName) => {
  socket.emit("controllerLog", "controller disqualifyPlayer");
  console.log("controller: strike");
  strikeThrough(userName);
});
