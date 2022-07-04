// lets go
console.log("start")
const socket = new io("http://localhost:9000", {});

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


