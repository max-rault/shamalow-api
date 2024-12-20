const express = require('express')
const requests = require('../controllers/requests.controller');
const router = express.Router()

  // Create a new shifts
  router.post("/", requests.create);

  // Retrieve all shifts
  router.get("/:filter", requests.findAll);

  // Retrieve a single shift with id
  router.get("/:id", requests.findOne);

  // Update a shift with id
  router.put("/:id", requests.update);

module.exports = router