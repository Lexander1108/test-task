const express = require('express');

const authRouter = express.Router();

const { authFunction } = require('../middlewares/authentication');
const { loginUser, logoutUser, createUser } = require('../controllers/index');

authRouter.get('/logout', authFunction, (req, res) => {
  logoutUser(req, res);
});

authRouter.post('/signin', authFunction, (req, res) => {
  loginUser(req, res);
});

authRouter.post('/signup', (req, res) => {
  createUser(req, res);
});

module.exports = authRouter;
