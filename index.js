const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
app.use(express.json());

app.use('/', (req, res) => {
  res.status(200).json('[GET] /home');
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express app listening at http://127.0.0.1:${PORT}`);
});
