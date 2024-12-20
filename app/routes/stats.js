const express = require('express')
const moment = require('moment')
const stats = require('../controllers/stats.controller');
const router = express.Router()

  // Retrieve all stats
  router.get("/", stats.findAll);

module.exports = router