const path = require('path');
const fs = require('fs');
const router = require('express').Router(); // создали роутер

function users() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));
}

router.get('/users', (req, res) => {
  try {
    res.send(users());
  } catch (e) {
    res.status(500).send({ error: 'Ошибка чтения файла' });
  }
});

router.get('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line no-underscore-dangle
    const user = users().filter((elem) => elem._id === id)[0];

    if (!user) {
      res.status(404).send({ message: 'Нет пользователя с таким id' });
      return;
    }

    res.send(user);
  } catch (e) {
    res.status(500).send({ error: 'Ошибка чтения файла' });
  }
});

module.exports = router; // экспортировали роутер
