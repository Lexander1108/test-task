const jwt = require('jsonwebtoken');

const { redisClient } = require('../services/redis.service');

async function authFunction(req, res, next) {
  await redisClient.init();

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

module.exports = { authFunction };
