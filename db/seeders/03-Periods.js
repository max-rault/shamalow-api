'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const Periods = [
        {
          name: 'Ouverture',
          start: 7,
          end: 11,
          duration: 4,
          minKitchen: 3,
          minWaiter: 3,
        },
        {
          name:'Dejeuner',
          start:11,
          end: 14,
          duration: 3,
          minKitchen: 18,
          minWaiter: 9,
        },
        {
          name:'Aprés-midi',
          start: 14,
          end: 18,
          duration: 4,
          minKitchen: 2,
          minWaiter: 2,
        },
        {
          name:'Diner',
          start: 18,
          end: 22,
          duration: 4,
          minKitchen: 18,
          minWaiter: 9,
        },
        {
          name:'Soir',
          start: 22,
          end: 24,
          duration: 2,
          minKitchen: 5,
          minWaiter: 2,
        }
      ]
    
      await queryInterface.bulkInsert('Periods', Periods)
      
    } catch (error) {
      console.log('error: ', error)
      
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
