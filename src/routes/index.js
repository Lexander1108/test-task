const express = require('express');

const { authFunction } = require('../middlewares/authentication');
const { createUser, loginUser, findUsers, logoutUser, latency } = require('../controllers/index');

const router = express.Router();

router.post('/signup', (req, res) => {
  createUser(req, res);
});

router.post('/signin', authFunction, (req, res) => {
  loginUser(req, res);
});

router.get('/info', (req, res) => {
  findUsers(req, res);
});

router.get('/logout', authFunction, (req, res) => {
  logoutUser(req, res);
});

router.get('/latency', async (req, res) => {
  latency(req, res);
});

module.exports = router;
