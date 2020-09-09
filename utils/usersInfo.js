var mongoClient = require("mongodb").MongoClient;
var messageObj = require("./messageManagement");

var users = [];
function newUserJoin(id, userName, roomName) {
  var user = { id, userName, roomName };
  mongoClient.connect(
    "mongodb://localhost:27017/",
    { useUnifiedTopology: true },
    (err, dbHost) => {
      if (err) {
        console.log(`Error connection to server`);
      } else {
        db = dbHost.db("wechat");
        db.collection("user", (err, coll) => {
          if (err) {
            console.log(`Error : ${err}`);
          } else {
            coll.insertOne(user);
          }
        });
      }
    }
  );
}
function getAllUsers(roomName, returnResult) {
  mongoClient.connect(
    "mongodb://localhost:27017/",
    { useUnifiedTopology: true },
    (err, dbHost) => {
      if (err) {
        console.log(`Error connection to server`);
      } else {
        db = dbHost.db("wechat");

        db.collection("user", function (err, coll) {
          if (err) {
            console.log(`Error : ${err}`);
            returnResult([]);
          } else {
            coll.find({ roomName: roomName }).toArray((err, dataArr) => {
              if (err) {
                console.log(`Error: ${err}`);
                returnResult([]);
              } else {
                // console.log(dataArr);
                returnResult(dataArr);
              }
            });
          }
        });
      }
    }
  );
  // return null;
}
function getUser(id) {
  mongoClient.connect(
    "mongodb://localhost:27017/",
    { useUnifiedTopology: true },
    (err, dbHost) => {
      if (err) {
        console.log(`Error connection to server`);
        return null;
      } else {
        db = dbHost.db("wechat");
        db.collection("user", (err, coll) => {
          if (err) {
            console.log(`Error : ${err}`);
            return null;
          } else {
            coll
              .findOne({ id: id })
              .then((data) => {
                console.log("Id");
                return data;
              })
              .catch((err) => {
                console.log(err);
                return null;
              });
          }
        });
      }
    }
  );
}

function removeUser(socketId, socket, io) {
  mongoClient.connect(
    "mongodb://localhost:27017/",
    { useUnifiedTopology: true },
    (err, dbHost) => {
      if (err) {
        console.log(`Error connection to server`);
      } else {
        db = dbHost.db("wechat");
        db.collection("user", (err, coll) => {
          if (err) {
            console.log(`Error : ${err}`);
          } else {
            coll.findOneAndDelete({ id: socketId }, (err, result) => {
              if (err) {
                console.log(`Error: ${err}`);
              } else {
                var obj = {
                  username: result.value.userName,
                  message: result.value.userName + " has left the room",
                  roomName: result.value.roomName,
                };
                messageObj.postMessage(obj);
                getAllUsers(obj.roomName, (data) => {
                  socket.to(obj.roomName).broadcast.emit("updateAllUser", data);
                  io.emit("welcomeUser", obj.message);
                });
              }
            });
          }
        });
      }
    }
  );
}

module.exports = { newUserJoin, getAllUsers, getUser, removeUser };
