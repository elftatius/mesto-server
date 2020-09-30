const mongoose = require('mongoose');
const { urlRegex } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Не верный url для аватара!',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
