// lets go
console.log("start")
const socket = new io("https://quiet-hamlet-04799.herokuapp.com/", {});

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


