const mongoose = require('mongoose');
const strValidator = require('validator');
const bcrypt = require('bcryptjs');

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
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return strValidator.isEmail(v);
      },
      message: 'Это не email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Неверный url для аватара',
    },
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
