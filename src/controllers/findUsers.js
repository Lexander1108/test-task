const User = require('../models/user-model');

async function findUsers(req, res) {
  const query = await User.find({}, 'id id_type');
  try {
    res.json(query);
  } catch (err) {
    res.send({ message: err });
  }
}

module.exports = { findUsers };
