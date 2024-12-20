'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shifts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.STRING
      },
      background: {
        type: Sequelize.STRING,
        allowNull: true
      },
      weekNumber:{
        type: Sequelize.INTEGER
      },
      StaffId:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {        
          model: 'Staffs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      PeriodId:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {        
          model: 'Periods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    }, {timestamps: false});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shifts');
  }
};