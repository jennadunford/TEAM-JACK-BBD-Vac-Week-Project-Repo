// lets go
console.log("MAIN JS");
//const socket = new io("http://localhost:9000", {});
const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});

function makeHost() {
  console.log("MAKE HOST");
  window.location.href = "./host.html";
  // socket.emit("User", document.getElementById("userName").value);
  // socket.emit("joinCode", document.getElementById("joinCode").value);
}
function makeController() {
  console.log("MAKE CONTROLLER");
  window.location.href = "controller.html";
  // socket.emit("ready");
}
