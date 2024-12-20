'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Staffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Active",
      },
      mail: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull:true
      },
      birthdate: {
        type: Sequelize.DATE
      },
      category: {
        type: Sequelize.STRING
      },
      subCategory: {
        type: Sequelize.STRING
      },
      contractType: {
        type: Sequelize.INTEGER
      },
      usagePrivileges:{
        type: Sequelize.STRING
      },
    }, {timestamps: false});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Staffs');
  }
};