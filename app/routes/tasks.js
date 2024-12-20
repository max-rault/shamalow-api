const express = require('express')
const moment = require('moment')
const tasks = require('../controllers/tasks.controller');
const router = express.Router()

  // Create a new tasks
  router.post("/", tasks.create);

  // Retrieve all tasks
  router.get("/:period/:date", tasks.findAll);

  // Retrieve a single task with id
  router.get("/:id", tasks.findOne);

  // Update a tasks with id
  router.put("/:id", tasks.update);

  // Delete a tasks with id
  router.delete("/:id", tasks.delete);

module.exports = router