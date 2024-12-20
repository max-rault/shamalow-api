'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Levels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Levels');
  }
};