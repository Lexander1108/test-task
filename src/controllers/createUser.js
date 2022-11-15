const User = require('../models/user-model');
const { idTypeSelector, generateToken } = require('../utils/index');

async function createUser(req, res) {
  const user = new User({
    id: req.body.id,
    password: req.body.password,
    id_type: idTypeSelector(req.body.id),
  });

  const accesstoken = generateToken(user);
  user.access_token = accesstoken;

  try {
    await user.save();
    res.json({ accesstoken });
  } catch (err) {
    res.send({ message: err });
  }
}

module.exports = { createUser };
