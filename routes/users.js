const path = require('path');
const fs = require('fs');
const router = require('express').Router(); // создали роутер

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));

router.get('/users', (req, res) => {
  res.send(users);
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line no-underscore-dangle
  const user = users.filter((elem) => elem._id === id)[0];

  if (!user) {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
    return;
  }

  res.send(user);
});

module.exports = router; // экспортировали роутер
