var chatForm = document.getElementById("chatForm");
var chatMessage = document.getElementById("txtChatMessage");
var allUsers = document.getElementById("allUsers");
var chatMessageDiv = document.getElementById("chatMessageDiv");

var username = Qs.parse(location.search, { ignoreQueryPrefix: true }).username;
var roomName = Qs.parse(location.search, { ignoreQueryPrefix: true }).roomName;
console.log(roomName);
document.getElementById("roomTitle").innerHTML = roomName + " Chat Room";
const socket = io();
socket.emit("joinRoom", { username: username, roomName: roomName });
socket.on("welcomeUser", (msg) => {
  var str = msg;
  var paraElement = document.createElement("div");
  var pTextNode = document.createTextNode(str);
  paraElement.appendChild(pTextNode);
  paraElement.style.textAlign = "center";
  paraElement.style.fontSize = "24px";
  paraElement.style.margin = "15px";
  paraElement.style.padding = "5px";
  paraElement.style.boxShadow = "-1px 1px 10px 6px black";
  chatMessageDiv.appendChild(paraElement);
});
socket.on("chatMessage", (obj) => {
  formatMessage(obj);
});
socket.on("updateList", (obj) => {
  var str = obj.username;
  var liElement = document.createElement("li");
  liElement.appendChild(document.createTextNode(str));
  allUsers.appendChild(liElement);
});
socket.on("allUsers", (obj) => {
  obj.forEach((ele) => {
    var str = ele.userName;
    var liElement = document.createElement("li");
    liElement.appendChild(document.createTextNode(str));
    allUsers.appendChild(liElement);
  });
  socket.emit("updateUsers", { username: username, roomName: roomName });
});
socket.on("updateAllUser", (obj) => {
  allUsers.innerHTML = "";
  obj.forEach((ele) => {
    var str = ele.userName;
    var liElement = document.createElement("li");
    liElement.appendChild(document.createTextNode(str));
    allUsers.appendChild(liElement);
  });
});
socket.on("newUserJoinMessage", (obj) => {
  var str = obj.username + " " + obj.message;
  var paraElement = document.createElement("div");
  var pTextNode = document.createTextNode(str);
  paraElement.appendChild(pTextNode);
  paraElement.style.textAlign = "center";
  paraElement.style.fontSize = "24px";

  paraElement.style.padding = "5px";
  paraElement.style.margin = "15px";
  paraElement.style.boxShadow = "-1px 1px 10px 6px black";
  chatMessageDiv.appendChild(paraElement);
});
function formatMessage(obj) {
  var str = obj.username + ": " + obj.message;
  var outerDiv = document.createElement("div");
  outerDiv.style.textAlign = "left";
  outerDiv.style.margin = "15px";
  var paraElement = document.createElement("div");
  var pTextNode = document.createTextNode(str);
  paraElement.appendChild(pTextNode);
  paraElement.style.fontSize = "24px";
  paraElement.style.padding = "10px";
  paraElement.style.boxShadow = "-1px 1px 10px 6px black";
  paraElement.style.display = "inline";
  outerDiv.appendChild(paraElement);
  chatMessageDiv.appendChild(outerDiv);
}
function sendMessageEventHandler() {
  var str = username + ": " + chatMessage.value;
  var outerDiv = document.createElement("div");
  outerDiv.style.textAlign = "right";
  outerDiv.style.margin = "15px";
  var paraElement = document.createElement("div");
  var pTextNode = document.createTextNode(str);
  paraElement.appendChild(pTextNode);
  paraElement.style.fontSize = "24px";
  paraElement.style.padding = "10px";
  paraElement.style.boxShadow = "-1px 1px 10px 6px black";
  paraElement.style.margin = "10px";
  paraElement.style.display = "inline";
  outerDiv.appendChild(paraElement);
  chatMessageDiv.appendChild(outerDiv);
  socket.emit("message", {
    message: chatMessage.value,
    username: username,
    roomName: roomName,
  });
  chatMessage.value = "";
}
