const fetch = require('node-fetch');

async function latency(req, res) {
  const url = 'https://google.com/';
  const options = {
    "method": "GET",
  };
  const start = Date.now();
  try {
    await fetch(url, options);
    const end = Date.now();
    res.send({ latency: end - start });
  } catch (err) {
    res.send({ message: err });
  }
}

module.exports = { latency };
