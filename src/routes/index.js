const express = require('express');
const fetch = require('node-fetch');

const { authFunction } = require('../middlewares/authentication');
const { createUser, loginUser, findUsers, logoutUser } = require('../controllers/index');

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
  const start = Date.now();
  try {
    await fetch('https://google.com/');
    const end = Date.now();
    res.json({ latency: end - start });
  } catch (err) {
    res.send({ message: err });
  }
});

module.exports = router;
