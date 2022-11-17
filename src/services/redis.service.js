const redis = require('redis');

class RedisClient {
  async init() {
    this.client = redis.createClient();
    this.connect = await this.client.connect();
  }

  get(key) {
    return this.client.get(key);
  }

  set(key, value) {
    return this.client.set(key, value);
  }

  expireAt(key, value) {
    return this.client.expireAt(key, value);
  }
}

const redisClient = new RedisClient();

module.exports = { redisClient };
