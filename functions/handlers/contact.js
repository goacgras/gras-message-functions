// const { json } = require("body-parser");
const { db, admin } = require("../util/admin");

const { validateEmail } = require("../util/validates");

exports.getContact = (req, res) => {
  // return res.json(req.user);
  const contactsDoc = db
    .collection("contacts")
    .where("uid", "==", req.user.uid);

  //firstimer create contact data
  contactsDoc
    .get()
    .then((doc) => {
      if (doc.empty) {
        const newUser = {
          uid: req.user.uid,
          email: req.user.email,
        };
        db.doc(`/contacts/${req.user.uid}`).set(newUser);
        return res.json({ message: "new user added to contacts" });
      } else {
        // return res.json(doc.docs[0].data());
        //check if user has contacts data
        db.collection("contacts")
          .doc(req.user.uid)
          .collection("userContacts")
          .orderBy("createdAt", "desc")
          .onSnapshot((snapshot) => {
            if (snapshot.empty) {
              return res.json({ message: "you have no contacts" });
            } else {
              let contacts = [];
              snapshot.forEach((contact) => {
                contacts.push({
                  contactId: contact.id,
                  email: contact.data().email,
                });
              });
              return res.json(contacts);
            }
          });
        // .get()
        // .then((userContacts) => {
        //   if (userContacts.empty) {
        //     //no contacts
        //     return res.json({ message: "you have no contacts" });
        //   } else {
        //     // return res.json(userContacts.docs[0].data());
        //     //getting contacts
        //     let contacts = [];
        //     userContacts.forEach((contact) => {
        //       contacts.push({
        //         contactId: contact.id,
        //         email: contact.data().email,
        //       });
        //     });
        //     return res.json(contacts);
        //   }
        // })
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).json({ error: err.code });
    });
};

exports.addContact = (req, res) => {
  if (req.body.email.trim() === "") {
    return res.status(400).json({ email: "email must not be empty" });
  }

  //validating email format
  const { errors, valid } = validateEmail(req.body.email.trim());
  if (!valid) return res.status(400).json(errors);

  //Check if user email exist
  db.collection("users")
    .where("email", "==", req.body.email.trim())
    .get()
    .then((userEmail) => {
      if (userEmail.empty) {
        return res.status(404).json({ error: "no user found" });
        //if exist
      } else {
        // return res.json({ message: "user found" });
        // add your own email
        if (req.body.email.trim() === req.user.email) {
          return res
            .status(400)
            .json({ error: "you can't add your own email" });
        } else {
          //Check if newContactData already in userContacts
          const newContactData = userEmail.docs[0].data();
          db.doc(`/contacts/${req.user.uid}/userContacts/${newContactData.uid}`)
            .get()
            .then((userContact) => {
              if (userContact.exists) {
                return res
                  .status(400)
                  .json({ error: "user already in your contact" });
              } else {
                //add new contact data
                newContactData.createdAt = new Date().toISOString();
                db.doc(
                  `/contacts/${req.user.uid}/userContacts/${newContactData.uid}`
                )
                  .set(newContactData)
                  .then(() => {
                    //TODO neeed to return to rooms collection and create room
                    return res.status(201).json({
                      message: newContactData.email + " successfully added",
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                    res.status(500).json({ error: "something went wrong" });
                  });
              }
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: "something went wrong" });
            });
        }
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).json({ error: err.code });
    });
};
