const socket = new io("http://localhost:9000", {});
var readyButton = document.getElementById("readyButton");
var readyState = document.getElementById("state");
var joinCode = document.querySelector("#joinCode");
var userName = document.querySelector("#userName");
var uName = document.getElementById("uName");
var jCode = document.getElementById("jCode");
var userReady = false;
var output;
// const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});

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
      socket.emit('User', userName.value);
      socket.emit('joinCode', joinCode.value);
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

// io.on('connection', (socket) => {

// });

socket.on('invalidCode', () => {
  alert('Client: invalid code')
  console.log('Client: invalid code');
  userReady = false;
  jCode.innerHTML = "";
  joinCode.value = "";
  readyState.innerHTML = "Not ready";
  readyButton.innerHTML = "Ready";
});

socket.on('validCode', () => {
  alert('Client: Code was accepted')
  console.log('Client: Code was accepted');
});


// let acl = new Accelerometer({frequency: 60});
// acl.addEventListener('reading', () => {
//   console.log("Acceleration along the X-axis " + acl.x);
//   console.log("Acceleration along the Y-axis " + acl.y);
//   console.log("Acceleration along the Z-axis " + acl.z);

//   alert("Acceleration along the X-axis " + acl.x + ", Y-axis: " + acl.y + ", Z-axis: " + acl.z);
// });

// acl.start();