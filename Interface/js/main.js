// lets go
console.log("MAIN JS");
const socket = new io("http://localhost:9000", {});

function makeHost() {
  console.log("MAKE HOST");
<<<<<<< Updated upstream
  window.location.href = "hostv2.html";
=======
  window.location.href = "./hostv2.html";

>>>>>>> Stashed changes
  // socket.emit("User", document.getElementById("userName").value);
  // socket.emit("joinCode", document.getElementById("joinCode").value);
}
function makeController() {
  console.log("MAKE CONTROLLER");
  window.location.href = "controller.html";
  // socket.emit("ready");
}
