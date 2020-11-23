const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");

const FBAuth = require("./util/fbAuth");
app.use(cors());

const { addContact, getContact } = require("./handlers/contact");

app.get("/contacts", FBAuth, getContact);
app.post("/contacts", FBAuth, addContact);

exports.api = functions.region("asia-southeast2").https.onRequest(app);
