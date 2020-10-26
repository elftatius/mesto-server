const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlRegex } = require('../utils/regex');
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(urlRegex).required(),
  }),
}), createCard);

router.get('/cards', getCards);

router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteCard);

router.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), likeCard);

router.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

module.exports = router;
