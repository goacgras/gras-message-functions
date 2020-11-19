const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");

const FBAuth = require("./util/fbAuth");
app.use(cors());

const { getContacts } = require("./handlers/room");

app.get("/contacts", FBAuth, getContacts);

exports.api = functions.region("asia-southeast2").https.onRequest(app);
