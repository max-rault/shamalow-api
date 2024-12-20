'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      avgKitchen: {
        type: Sequelize.FLOAT
      },
      avgCounter: {
        type: Sequelize.FLOAT
      },
      avgCleaning: {
        type: Sequelize.FLOAT
      },
      staffJoining: {
        type: Sequelize.INTEGER
      },
      staffLeaving: {
        type: Sequelize.INTEGER
      },
    }, {timestamps: false});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stats');
  }
};