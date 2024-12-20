const express = require('express')
const router = express.Router()
const staff = require('../controllers/staff.controller')
const { signIn, getUser, updateAccount } = require('../services/auth.service')


  //auth user
  router.post("/auth", signIn);

  //retrieve user account
  router.get('/user/:id', getUser)

  //update user account
  router.post('/user', updateAccount)

   // Create a new Staff member
   router.post("/", staff.create);

  // Retrieve a single Staff member with id
  router.get("/member/:id/:date", staff.findOne);

  // Retrieve all Staff members
  router.get("/", staff.findAll);

  // Update a Staff member with id
  router.put("/:id", staff.update);

  // Delete a Staff member with id
  router.delete("/:id", staff.delete);

module.exports = router