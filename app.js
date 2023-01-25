const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter = require('./src/routes/auth.router');
const latencyRouter = require('./src/routes/latency.router');
const findUsersRouter = require('./src/routes/users.router');
const { redisClient } = require('./src/services/redis.service');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/latency', latencyRouter);
app.use('/users', findUsersRouter);

const port = process.env.PORT;
const connectionString = process.env.DB_CONNECTION_STRING;

(async () => {
  await redisClient.init();
})();

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
