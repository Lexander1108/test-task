const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN, { expiresIn: '100m' });
}

function idTypeSelector(id) {
  const idToArray = id.split('');
  if (idToArray.includes('@') && idToArray.includes('.')) {
    return 'email';
  }
  if (Number.isNaN(Number(id)) === false) {
    return 'phone';
  }
  return null;
}

function tokenCollector(query) {
  return query.map((item) => item.access_token);
}

module.exports = {
  idTypeSelector,
  generateToken,
  tokenCollector,
};
