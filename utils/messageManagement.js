var mongoClient = require("mongodb").MongoClient;

messages = [];
function postMessage(obj) {
  messages.push(obj);
  mongoClient.connect(
    "mongodb://localhost:27017/",
    { useUnifiedTopology: true },
    (err, dbHost) => {
      if (err) {
        console.log(`Error connection to server`);
      } else {
        db = dbHost.db("wechat");
        db.collection("message", (err, coll) => {
          if (err) {
            console.log(`Error : ${err}`);
          } else {
            coll.insertOne(obj);
          }
        });
      }
    }
  );
}
function getAllMessages() {
  return messages;
}

module.exports = { postMessage, getAllMessages };
