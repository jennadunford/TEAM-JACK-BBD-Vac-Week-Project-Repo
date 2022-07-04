var userName = document.querySelector("#userName");

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
