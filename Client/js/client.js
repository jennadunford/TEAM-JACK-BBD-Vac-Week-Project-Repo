// lets go
console.log("start")
const socket = new io("http://localhost:9000", {});

socket.on("connect", function() 
{
    socket.emit("User", document.getElementById("username").value);

})


