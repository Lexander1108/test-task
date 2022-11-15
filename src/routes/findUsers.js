const express = require('express');

const { findUsers } = require('../controllers/findUsers');

const findUsersRouter = express.Router();

findUsersRouter.get('/info', (req, res) => {
  findUsers(req, res);
});

module.exports = findUsersRouter;
