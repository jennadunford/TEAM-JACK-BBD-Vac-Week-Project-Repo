// const socket = new io("http://localhost:9000", {});
// const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});
// var readyButton = document.getElementById("readyButton");
// var readyState = document.getElementById("state");
// var joinCode = document.querySelector("#joinCode");
// var userName = document.querySelector("#userName");
// var uName = document.getElementById("uName");
// var jCode = document.getElementById("jCode");
// var userReady = false;
// var output;
// var xOutput = document.getElementById("xRead");
// var yOutput = document.getElementById("yRead");
// var zOutput = document.getElementById("zRead");
// var normOutput = document.getElementById("norm");

var lower_threshold = 0;
var upper_threshold = 30;
var hard_cap = 50;

var updateState = document.getElementById("updateState");
var updateMag = document.getElementById("updateMag");

var dqFlag = false;



// function updateReadings() {
//     let acl = new LinearAccelerationSensor({ frequency: 60 });
//     acl.addEventListener("reading", () => {
//       //console.log("Acceleration along the X-axis " + acl.x);
//       xOutput.innerHTML = acl.x.toFixed(2);
//       yOutput.innerHTML = acl.y.toFixed(2);
//       zOutput.innerHTML = acl.z.toFixed(2);
  
//       sensorAccelerationMagnitude = Math.sqrt(
//         acl.x * acl.x + acl.y * acl.y + acl.z * acl.z
//       );
  
//       normOutput.innerHTML = sensorAccelerationMagnitude.toFixed(2);

//     });
//     acl.start();
//     return sensorAccelerationMagnitude;
//   }
  
function alert_disqualify(acc_magnitude) 
{
    if (acc_magnitude >= upper_threshold || acc_magnitude > hard_cap || dqFlag) // disqualify the player:
    {
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
    } else if (acc_magnitude >= (upper_threshold * 2) / 3) 
    {
      //alert user that they are close to threshold by making their screen orange
      updateState.innerHTML = "Close";
      document.body.style.background = "orange";
      return;
    } else if (acc_magnitude >= (upper_threshold * 1) / 6) 
    {
      updateState.innerHTML = "Far";
      //alert user that they are approaching the threshold by making their screen yellow
      document.body.style.background = "yellow";
      return;

    } else 
    {
      //ie: if acc_magnitude<upper_threshold*0.75 && acc_magnitude>lower_threshold
      //make their screen green
      updateState.innerHTML = "Safe " + acc_magnitude.toFixed(2);

      document.body.style.background = "green";
      return;

    }
}
  
function getAccel() 
{
    console.log("permissions button pressed");
    var accelX, accelY, accelZ;
    var accelerationMagnitude;

    if (typeof DeviceMotionEvent.requestPermission === "function") 
    {
        DeviceMotionEvent.requestPermission().then((response) => 
        {
            if (response == "granted") 
            {
                window.addEventListener("devicemotion", (event) => {
                // do something with event
                accelX = event.acceleration.x;
                accelY = event.acceleration.y;
                accelZ = event.acceleration.z;

                // xOutput.innerHTML = event.acceleration.x.toFixed(2);
                // yOutput.innerHTML = event.acceleration.y.toFixed(2);
                // zOutput.innerHTML = event.acceleration.z.toFixed(2);
                // updateState.innerHTML = "Started motion sensing";
  
                accelerationMagnitude = Math.sqrt( (accelX*accelX) + (accelY*accelY) + (accelZ*accelZ) );
                
  
                //process magnitude

                //   normOutput.innerHTML = Math.sqrt(
                //     event.acceleration.x * event.acceleration.x +
                //       event.acceleration.y * event.acceleration.y +
                //       event.acceleration.z * event.acceleration.z
                //   ).toFixed(2);

                // alert_disqualify(acc_magnitude);
                });
            }
        }).catch(console.error);
    } else 
    {
        let acl = new LinearAccelerationSensor({ frequency: 60 });
        console.log("alert_disqualify");
        acl.addEventListener("reading", () => {
            //console.log("Acceleration along the X-axis " + acl.x);
            accelX = acl.x;
            accelY = acl.y;
            accelZ = acl.z;
      
            accelerationMagnitude = Math.sqrt( (accelX*accelX) + (accelY*accelY) + (accelZ*accelZ) );    
        });
        acl.start();
        
        // alert_disqualify(updateReadings())
        // non iOS 13+
        // updateReadings();
      
        //   lacl = new LinearAccelerationSensor({ frequency: 60 });
        //   lacl.addEventListener("reading", () => {
        //     acc_magnitude = Math.sqrt(
        //       lacl.x * lacl.x + lacl.y * lacl.y + lacl.z * lacl.z
        //     );
        //     // alert("Acceleration along the X-axis " + acl.x + ", Y-axis: " + acl.y + ", Z-axis: " + acl.z);
        //     alert_disqualify(acc_magnitude);
        //   });
        //   lacl.start();
    }
    alert_disqualify(accelerationMagnitude);
}
  
if (sessionStorage.getItem("Playing")) 
{
    console.log("running");
    setInterval(getAccel(), 500);
}

// DeviceMotionEvent.requestPermission().then((response) => 
// {
//     if (response == "granted") 
//     {
//       console.log("accelerometer permission granted");
//       // Do stuff here
//     }

// });

