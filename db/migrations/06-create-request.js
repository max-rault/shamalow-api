'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      creationDate: {
        type: Sequelize.DATE
      },
      contents: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      },
      startPeriod: {
        type: Sequelize.DATEONLY
      },
      endPeriod: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'being processed',
        allowNull: false
      },
      StaffId:{
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Staffs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    }, {timestamps: false});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Requests');
  }
};