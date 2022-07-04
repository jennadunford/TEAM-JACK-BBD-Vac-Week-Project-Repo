// lets go
console.log("start")
const socket = new io("http://localhost:9000", {});

function sendUsername()
{
    socket.emit("User", document.getElementById("username").value);
}
// socket.on("connect", function() 
// {
    

// })


