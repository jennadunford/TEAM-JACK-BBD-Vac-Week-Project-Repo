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

$("#readyButton").click(function () {
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
});

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

function updateReadings() {
  let acl = new Accelerometer({ frequency: 60 });
  acl.addEventListener("reading", () => {
    //console.log("Acceleration along the X-axis " + acl.x);
    xOutput.innerHTML = acl.x;
    yOutput.innerHTML = acl.y;
    zOutput.innerHTML = acl.z;

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
}
setInterval(updateReadings(), 100);
