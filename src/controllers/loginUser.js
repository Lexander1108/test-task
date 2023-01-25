const User = require('../models/user-model');

async function loginUser(req, res) {
  const user = await User.findOne({ id: req.body.id, password: req.body.password }, 'id id_type');
  try {
    res.send(user);
  } catch (err) {
    res.send({ message: err });
  }
}

module.exports = { loginUser };
