const socket = new io("http://localhost:9000", {});
// const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});
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
var normOutput = document.getElementById("norm")

var acc_magnitude=0;
let lacl = new LinearAccelerationSensor({frequency: 60});
var lower_threshold = 0;
var upper_threshold = 30;
var hard_cap = 50;

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
      sessionStorage.setItem('userName', userName.value)
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

socket.on('updateSensitivity', (songSensitivity) =>{
    if(songSensitivity == 0.2){ // slow
        upper_threshold = 0;
    } else if(songSensitivity == 1){ // normal
        upper_threshold = 10;
    } else if(songSensitivity == 1.2){ // fast
        upper_threshold = 20;
    }
    
    // TODO: check that song sensitivity makes sense for thresholds
})

function updateReadings() {
  let acl = new LinearAccelerationSensor({ frequency: 60 });
  acl.addEventListener("reading", () => {
    //console.log("Acceleration along the X-axis " + acl.x);
    xOutput.innerHTML = acl.x.toFixed(2);
    yOutput.innerHTML = acl.y.toFixed(2);
    zOutput.innerHTML = acl.z.toFixed(2);

    normOutput.innerHTML = Math.sqrt((acl.x*acl.x) + (acl.y*acl.y) + (acl.z*acl.z)).toFixed(2)

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

function alert_disqualify()
{ 
  lacl = new LinearAccelerationSensor({frequency: 60});
  lacl.addEventListener('reading', () => {
    acc_magnitude = sqrt(lacl.x*lacl.x + lacl.y*lacl.y + lacl.z*lacl.z)
    if (acc_magnitude>=upper_threshold || acc_magnitude<=lower_threshold || acc_magnitude > hard_cap){
      // disqualify the player:
        // tell player that player is disqualified by making their screen red
      document.body.style.background = "red";

      // tell server that player is disqualifyed
      socket.emit('disqualifyPlayer', sessionStorage.getItem('userName'));
      console.log(sessionStorage.getItem('userName') + ' was disqualified');
          //on server:
          //sort board
          //grey them out on the scoreboard
    } else if (acc_magnitude>=upper_threshold * 0.9){
      //alert user that they are close to threshold by making their screen orange
      document.body.style.background = "orange";
    }else if (acc_magnitude>=upper_threshold * 0.75){
      //alert user that they are approaching the threshold by making their screen yellow
      document.body.style.background = "yellow";
    }else {//ie: if acc_magnitude<upper_threshold*0.75 && acc_magnitude>lower_threshold
      //make their screen green
      document.body.style.background = "green";
    }
    // alert("Acceleration along the X-axis " + acl.x + ", Y-axis: " + acl.y + ", Z-axis: " + acl.z);
    
  });
  acl.start();
}

setInterval(updateReadings(), 500);

function getAccel()
{
  console.log("permissions button pressed")
  if (typeof DeviceMotionEvent.requestPermission === 'function') 
  {
    DeviceMotionEvent.requestPermission().then(response => 
      {
        if (response == 'granted') 
        {
          setInterval(updateReadings(), 500);          
        }
      })
      .catch(console.error)
  } else 
  {
    // non iOS 13+
  }
  
}
