'use strict';
const moment = require('moment');

async function fillData(){

  var data = []
  for (let index = 0; index < 12; index++) {
    var randomKitchen = Math.floor(Math.random()*100)
    var randomCounter = Math.floor(Math.random()*100)
    var randomCleaning = Math.floor(Math.random()*100)

    var randomJoining = Math.floor(Math.random() * 20) 
    var randomLeaving = Math.floor(Math.random() * 20) 
    data.push({
      date: moment(`2023-${index+1}-01`).format('YYYY-MM-DD'),
      avgKitchen: randomKitchen,
      avgCounter: randomCounter,
      avgCleaning: randomCleaning,
      staffJoining: randomJoining,
      staffLeaving: randomLeaving,
    })
    
  }
  return data
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   try {
      const data = await fillData()
      await queryInterface.bulkInsert('Stats', data)
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
