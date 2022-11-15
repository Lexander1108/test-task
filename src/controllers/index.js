const { createUser } = require('./createUser');
const { loginUser } = require('./loginUser');
const { findUsers } = require('./findUsers');
const { logoutUser } = require('./logoutUser');
const { latency } = require('./latency');

module.exports = {
  createUser,
  loginUser,
  findUsers,
  logoutUser,
  latency,
};
