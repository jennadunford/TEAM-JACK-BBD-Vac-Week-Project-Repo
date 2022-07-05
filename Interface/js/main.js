// lets go
console.log("MAIN JS")
const socket = new io("http://localhost:9000", {});

function makeHost()
{
    console.log('MAKE HOST');
    window.location.href = './html/host.html'
    // socket.emit("User", document.getElementById("userName").value);
    // socket.emit("joinCode", document.getElementById("joinCode").value);
}
function makeController(){
    console.log('MAKE CONTROLLER');
    window.location.href = './html/controller.html'
    // socket.emit("ready");
}