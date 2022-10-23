const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fetch = require('node-fetch');
const redis = require('redis');

const User = require('./model/user');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT;
const connectionString = process.env.DB_CONNECTION_STRING;

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

async function mongodbConnect() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
  }
}

mongodbConnect();

app.listen(port, () => console.log(`Listening on Port: ${port}`));

function idTypeSelector(id) {
  const idToArray = id.split('');
  if (idToArray.includes('@') && idToArray.includes('.')) {
    return 'email';
  }
  if (Number.isNaN(Number(id)) === false) {
    return 'phone';
  }
  return 0;
}

function generateToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN, { expiresIn: '100m' });
}

app.post('/signup', async (req, res) => {
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

app.get('/info', async (req, res) => {
  const query = await User.find({}, 'id id_type');
  try {
    res.json(query);
  } catch (err) {
    res.send({ message: err });
  }
});

async function authFunction(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (token == null) {
    return res.status(401).send({
      message: 'No token provided',
    });
  }

  const inDenyList = await redisClient.get(`bl_${token}`);
  if (inDenyList) {
    return res.status(401).send({
      message: 'Token Rejected',
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
  });

  next();

  return null;
}

app.post('/signin', authFunction, async (req, res) => {
  const user = await User.findOne({ id: req.body.id, password: req.body.password }, 'id id_type');
  res.send(user);
  try {
    res.send(user);
  } catch (err) {
    res.send({ message: err });
  }
});

app.get('/latency', async (req, res) => {
  const start = Date.now();
  try {
    await fetch('https://google.com/');
    const end = Date.now();
    res.json({ latency: end - start });
  } catch (err) {
    res.send({ message: err });
  }
});

function tokenCollector(query) {
  return query.map((item) => item.access_token);
}

app.get('/logout', authFunction, async (req, res) => {
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
