const { admin, db } = require("./admin");
const firebaseConfig = require("./firebaseConfig");
const firebase = require("firebase").default;
firebase.initializeApp(firebaseConfig);

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  //verifies token issued by applications
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      console.log("[DECOEDED TOKEN: ]", decodedToken);
      return db
        .doc(`/users/${req.user.uid}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return next();
          } else {
            const newUser = {
              uid: req.user.uid,
            };
            return db.doc(`/users/${req.user.uid}`).set(newUser);
          }
        })
        .catch((err) => {
          console.error("error while checking");
          return res.status(403).json(err);
        });
    })
    .then((data) => {
      console.log("[THIS IS DATA]", data);
      //   req.user.uid = data.docs[0].data().uid;
      return next();
    })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return res.status(403).json(err);
    });
};
