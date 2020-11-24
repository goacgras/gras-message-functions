const { db, admin } = require("../util/admin");

exports.sendMessage = (req, res) => {
  const roomId = req.user.params;

  const message = {
    message: req.body.input,
    by: req.user.uid,
    createdAt: new Date().toISOString(),
  };
  db.collection("messages")
    .doc(req.user.params)
    .collection("roomMessages")
    .add(message);
};

exports.getMessage = (req, res) => {
  const messages = [];
  db.collection("messages")
    .doc(req.user.params)
    .collection("roomMessages")
    .orderBy("createdAt", "asc")
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });
    });
  return res.json(messages);
};
