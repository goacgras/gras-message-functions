const { db, admin } = require("../util/admin");

exports.getContacts = (req, res) => {
  return res.json(req.user);
};
