// lets go
console.log("start")
// const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});
const socket = new io("https://jack-joust.herokuapp.com/", {});


function sendUsername()
{
    socket.emit("User", document.getElementById("userName").value);
    socket.emit("joinCode", document.getElementById("joinCode").value);
}
function sayReady(){
    console.log('say ready')
    socket.emit("ready");
}
// socket.on("connect", function() 
// {
    

// })
let acl = new Accelerometer({frequency: 60});
acl.addEventListener('reading', () => {
  console.log("Acceleration along the X-axis " + acl.x);
  console.log("Acceleration along the Y-axis " + acl.y);
  console.log("Acceleration along the Z-axis " + acl.z);

  alert("Acceleration along the X-axis " + acl.x + ", Y-axis: " + acl.y + ", Z-axis: " + acl.z);
});

acl.start();

