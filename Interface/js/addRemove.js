function addPlayer(userName) {
  const node = document.createElement("li");
  const textnode = document.createTextNode(userName);
  node.appendChild(textnode);
  document.getElementById("playerList").appendChild(node);
}

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

function strikeThrough(userName) {
  let nodes = Array.from($("#playerList").children("li"));
  for (let count = 0; count < nodes.length; count++) {
    const element = nodes[count];
    console.log(nodes[count].innerHTML);
    if (element.innerHTML == userName) {
      element.innerHTML.strike();
      break;
    }
  }
}

function showCrown() {
  var crown = document.getElementById("winImage");
  crown.classList.remove("hidden");
}
