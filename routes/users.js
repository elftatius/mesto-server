const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const { urlRegex } = require('../utils/regex');
const auth = require('../middlewares/auth');
const {
  createUser, getUser, getUsers, updateAvatar, updateProfile, login,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().regex(urlRegex).required(),
  }),
}), createUser);

router.use(auth);

router.get('/users', getUsers);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex).required(),
  }),
}), updateAvatar);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

module.exports = router;
