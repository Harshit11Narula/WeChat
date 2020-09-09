var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
var http = require("http");
var socketIo = require("socket.io");
var queryString = require("querystring");

var userObj = require("./utils/usersInfo");
var messageObj = require("./utils/messageManagement");

var app = express();
const server = http.createServer(app);
var io = socketIo(server);

var PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  var fileUrl = path.join(__dirname, "public", "login.html");
  res.sendFile(fileUrl);
});
app.get("/room", (req, res) => {
  var fileUrl = path.join(__dirname, "public", "room.html");
  res.sendFile(fileUrl);
});
app.post("/home", (req, res) => {
  var userName = req.body.username;
  var temp = queryString.stringify({
    username: userName,
  });
  res.redirect("/room?" + temp);
});
app.post("/data", (req, res) => {
  var userName = req.body.username;
  var roomName = req.body.roomName;
  var temp = queryString.stringify({
    username: userName,
    roomName: roomName,
  });
  res.redirect("/chat?" + temp);
});
app.get("/chat", (req, res) => {
  var fileUrl = path.join(__dirname, "public", "chat.html");
  res.sendFile(fileUrl);
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    // console.log(data);
    socket.join(data.roomName);
    var obj = {
      username: data.username,
      message: "has joined",
      roomName: data.roomName,
    };

    userObj.newUserJoin(socket.id, data.username, data.roomName);
    messageObj.postMessage(obj);

    socket.emit("welcomeUser", `Welcome ${data.username} to the Room`);
    socket.to(data.roomName).broadcast.emit("newUserJoinMessage", obj);

    userObj.getAllUsers(data.roomName, (data) => {
      if (data.length == 0) {
        console.log(`Error while getting data`);
      }
      socket.emit("allUsers", data);
    });
  });
  socket.on("disconnect", () => {
    userObj.removeUser(socket.id, socket, io);
  });
  socket.on("message", (obj) => {
    messageObj.postMessage(obj);
    socket.to(obj.roomName).broadcast.emit("chatMessage", obj);

  });
  socket.on("updateUsers", (obj) => {
    socket.to(obj.roomName).broadcast.emit("updateList", obj);
  });
});

server.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server started at port ${PORT}`);
  }
});
