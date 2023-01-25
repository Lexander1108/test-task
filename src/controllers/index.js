const { findUsers } = require('./findUsers');
const { latency } = require('./latency');
const { createUser } = require('./createUser');
const { loginUser } = require('./loginUser');
const { logoutUser } = require('./logoutUser');

module.exports = {
  findUsers,
  latency,
  createUser,
  loginUser,
  logoutUser,
};
