const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./src/routes/index');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/', routes);

const port = process.env.PORT;
const connectionString = process.env.DB_CONNECTION_STRING;

async function mongodbConnect() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
  }
}

mongodbConnect();

app.listen(port, () => console.log(`Listening on Port: ${port}`));
