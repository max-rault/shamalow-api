'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Periods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      start: {
        type: Sequelize.INTEGER
      },
      end: {
        type: Sequelize.INTEGER
      },
      duration: {
        type: Sequelize.INTEGER
      },
      minKitchen: {
        type: Sequelize.INTEGER
      },
      minWaiter: {
        type: Sequelize.INTEGER
      },
    },{timestamps: false});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Periods');
  }
};