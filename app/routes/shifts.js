const express = require('express')
const shift = require('../controllers/shifts.controller');
const router = express.Router()

  // Create a new shifts
  router.post("/", shift.create);

  // Retrieve all shifts
  router.get("/", shift.findAll);

  // Retrieve a single shift with id
  router.get("/:id", shift.findOne);

  // Update a shift with id
  router.put("/:id", shift.update);

  // Delete a shift with id
  router.delete("/:id", shift.delete);

module.exports = router