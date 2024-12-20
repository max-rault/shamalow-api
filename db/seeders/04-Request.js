'use strict';
const moment = require('moment');
/** @type {import('sequelize-cli').Migration} */
async function fillArray(){
  const RequestsArray = []
  const titleArray = ['demande de congés sans soldes','demande de congés payés','demande de congés parentale']
  const randomNum = Math.floor(Math.random()*(40 - 30)) + 30
  const statusArray = ['being processed','accepted', 'refused']

  for (let index = 0; index < randomNum; index++) {
    RequestsArray.push({
      creationDate: new Date(),
      contents: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius rhoncus aliquet. Quisque mauris felis, sodales vitae quam a, vestibulum imperdiet nibh. Nulla et lacinia lectus, mollis placerat quam. Quisque porta condimentum urna ut egestas. Morbi eu augue vel nisl gravida molestie. Aliquam erat volutpat. Aenean in ligula id lectus facilisis feugiat. Donec volutpat lorem sapien, vitae consectetur orci aliquam sit amet. In nec erat blandit, consectetur velit porttitor, pretium sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sapien ex, congue fringilla sapien sollicitudin, pharetra aliquet leo. Ut nec ipsum diam. Fusce viverra metus eu justo maximus condimentum. Pellentesque luctus tempor lobortis. Fusce mollis magna ut justo volutpat, non viverra purus porta.",
      title: titleArray[Math.round(Math.random()*(titleArray.length-1))],
      startPeriod: moment('2024-02-16').format('YYYY-MM-DD'),
      endPeriod: moment('2024-03-16').format('YYYY-MM-DD'),
      status: statusArray[Math.round(Math.random()*(statusArray.length-1))],
      StaffId: index+1

    })
  }
  return RequestsArray
}
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
    
        
      const Requests  = await fillArray()
      await queryInterface.bulkInsert('Requests', Requests)
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
