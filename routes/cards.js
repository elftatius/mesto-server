const path = require('path');
const fs = require('fs');
const router = require('express').Router(); // создали роутер

const cards = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cards.json')));

router.get('/cards', (req, res) => {
  res.send(cards);
});

module.exports = router; // экспортировали роутер
