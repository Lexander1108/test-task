const express = require('express');

const latencyRouter = express.Router();

const { latency } = require('../controllers/index');

latencyRouter.get('/google', async (req, res) => {
  latency(req, res);
});

module.exports = latencyRouter;
