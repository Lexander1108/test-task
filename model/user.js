const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  id_type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('users', userSchema);
