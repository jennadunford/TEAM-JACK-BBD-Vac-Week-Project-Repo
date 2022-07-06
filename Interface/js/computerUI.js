// var userName = document.querySelector("#userName");
// const socket = new io("http://localhost:9000", {});
// console.log("computer ui");

var userName = document.getElementById("userName");

$("#generateButton").click(function () {
  var joinCodeDisplay = document.getElementById("joinCode");
  joinCodeDisplay.innerHTML = "ABCD";
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
