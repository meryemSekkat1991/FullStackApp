const express = require('express');

const app = express();

app.use((req, res,next) => {
  console.log('first midlewasre ')
  next();
});


app.use((req, res,next) => {
  console.log('second midle');
  res.send('hello from express test')
});

module.exports = app;
