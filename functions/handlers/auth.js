const { db, admin } = require("../util/admin");
const firebaseConfig = require("../util/firebaseConfig");
const firebase = require("firebase").default;
firebase.initializeApp(firebaseConfig);

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  auth
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signup successfully` });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.successAuth = (req, res) => {
  const data = JSON.stringify(req.user);
  return res.send(`welcome ${data}`);
};

exports.failedAuth = (req, res) => {
  res.send("you failed to login");
};

exports.logout = (req, res) => {
  req.session = null;
  req.logout();
  return res.send("your logout!");
};

exports.signinWithPopup = (req, res) => {
  firebase
    .auth()
    .currentUser.getIdToken()
    .then((idToken) => {
      const token = idToken;
      return res.json({ token });
    });
};
