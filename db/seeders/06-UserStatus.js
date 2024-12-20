'use strict';
const db = require('../models')
const Staff = db.Staff
const UserStatus = db.UserStatus

const statusArray = ['Actif', 'Actif', 'Actif', 'Mise à pied', 'Vacance', 'Formation', 'Actif']

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const staffMembers = await Staff.findAll()
      const statusData = []
      staffMembers.forEach(member => {
        const randomDay = Math.floor(Math.random()*(24-1))
        const randomMonth = Math.floor(Math.random()*11)
        const randomStatus = statusArray[Math.floor(Math.random()*(statusArray.length - 1))]
        const range = [new Date(Date.UTC(2024, randomMonth, randomDay)).toISOString(), new Date(Date.UTC(2024, randomMonth, (randomDay+3))).toISOString()];
  
        statusData.push({
          status: randomStatus,
          period: randomStatus  === 'Actif' ? null:`(${range[0]}, ${range[1]}]`,
          StaffId: member.id
        })
      });

      await queryInterface.bulkInsert('UserStatuses', statusData)
    } catch (error) {
      console.log(error)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
