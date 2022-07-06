// var userName = document.querySelector("#userName");
//const socket = new io("http://localhost:9000", {});
// console.log("computer ui");
const socket = new io("https://damp-gorge-23211.herokuapp.com/", {});

var joinCodeDisplay = document.getElementById("joinCode");
$("#generateButton").click(function () {
  socket.emit("generateCode");
});

// socket.on('connection', (socket) => {

// });

socket.on("codeGenerated", (code) => {
  joinCodeDisplay.innerHTML = code;
});

$("#addPlayer").click(function () {
  if (userName.value == "") {
    alert("Please enter a username");
  } else {
    addPlayer(userName.value);
  }
});

function addPlayer(userName) {
  const node = document.createElement("li");
  const textnode = document.createTextNode(userName);
  node.appendChild(textnode);
  document.getElementById("playerList").appendChild(node);
}

$("#startButton").click(function () {
  $("#startGamePressed").fadeIn(500);
  $("#startGamePressed").fadeOut(500);
  socket.emit("startGame");
});

socket.on("userJoined", (user) => {
  console.log(user);
  addPlayer(user);
});
$("#removePlayer").click(function () {
  removePlayer(userName.value);
});
function removePlayer(userName) {
  let nodes = Array.from($("#playerList").children("li"));
  for (let count = 0; count < nodes.length; count++) {
    const element = nodes[count];
    console.log(nodes[count].innerHTML);
    if (element.innerHTML == userName) {
      element.parentNode.removeChild(element);
      break;
    }
  }
}
