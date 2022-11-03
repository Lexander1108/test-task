const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const User = require('../models/user-model');
const { authFunction } = require('../middlewares/authentication');
const { idTypeSelector, generateToken, tokenCollector } = require('../utils/index');

const router = express.Router();

let redisClient = null;

(async () => {
  redisClient = redis.createClient();

  redisClient.on('error', (error) => {
    console.log(error);
  });
  redisClient.on('connect', () => {
    console.log('Redis connected');
  });

  await redisClient.connect();
})();

router.post('/signup', async (req, res) => {
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
});

router.post('/signin', authFunction, async (req, res) => {
  const user = await User.findOne({ id: req.body.id, password: req.body.password }, 'id id_type');
  res.send(user);
  try {
    res.send(user);
  } catch (err) {
    res.send({ message: err });
  }
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

router.get('/info', async (req, res) => {
  const query = await User.find({}, 'id id_type');
  try {
    res.json(query);
  } catch (err) {
    res.send({ message: err });
  }
});

router.get('/logout', authFunction, async (req, res) => {
  if (req.body.all === true) {
    const query = await User.find({}, 'access_token');
    const allTokens = tokenCollector(query);
    const tokenKeys = allTokens.map((token) => `bl_${token}`);

    for (let i = 0; i < allTokens.length; i + i) {
      redisClient.set(tokenKeys[i], allTokens[i]);
      redisClient.expireAt(tokenKeys[i], '10m');
    }

    try {
      res.status(200).send('All tokens invalidated');
    } catch (err) {
      res.send({ message: err });
    }
  } else if (req.body.all === false) {
    const currentToken = req.headers.authorization.split(' ')[1];
    const tokenKey = `bl_${currentToken}`;

    try {
      await redisClient.set(tokenKey, currentToken);
      redisClient.expireAt(tokenKey, '10m');
      res.status(200).send('Token invalidated');
    } catch (err) {
      res.send({ message: err });
    }
  }
});

module.exports = router;
