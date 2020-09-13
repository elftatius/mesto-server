const path = require('path');
const fs = require('fs');
const router = require('express').Router(); // создали роутер

router.get('/cards', (req, res) => {
  try {
    const cards = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cards.json')));
    res.send(cards);
  } catch (e) {
    res.status(500).send({ error: 'Ошибка чтения файла' });
  }
});

module.exports = router; // экспортировали роутер
