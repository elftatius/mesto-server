const express = require('express');
const path = require('path');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const app = express();
const port = 3000;

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
