const jwt = require('jsonwebtoken');
const redis = require('redis');

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

async function authFunction(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (token == null) {
    return res.status(401).send({
      message: 'No token provided',
    });
  }

  const inDenyList = await redisClient.getRedisAsync(`bl_${token}`);
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
