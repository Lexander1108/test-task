const User = require('../models/user-model');
const { tokenCollector } = require('../utils/index');
const { redisClient } = require('../services/redis.service');

async function logoutUser(req, res) {
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
}

module.exports = { logoutUser };
