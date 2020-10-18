const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const DuplicationError = require('../errors/duplication-err');

const User = require('../models/user');
const { passwordRegex } = require('../utils/regex');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!passwordRegex.test(password)) {
    throw new ValidationError();
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userToReturn = user.toJSON();
      delete userToReturn.password;
      res.send({ data: userToReturn });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError();
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new DuplicationError('Такой e-mail уже занят!');
      }
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  User
    .findById(id)
    .then(
      (user) => {
        if (!user) {
          throw new NotFoundError('Такой пользователь не найден!');
        }
        res.send({ data: user });
      },
    )
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then(
      (user) => {
        if (!user) {
          throw new NotFoundError('Такой пользователь не найден!');
        }
        res.send({ data: user });
      },
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError();
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError();
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Такой пользователь не найден!');
      }
    })
    .catch(next);
};
