'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tasks.belongsTo(models.Staff, {
        foreignKey: "StaffId",
      })

      Tasks.belongsTo(models.Periods, {
        foreignKey:{
          name: "PeriodId",
          allowNull: true
        },
        foreignKeyConstraint: 'fk_Shifts_PeriodId',
      })
    }
    
  }
  Tasks.init({
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    x: DataTypes.FLOAT,
    y: DataTypes.FLOAT,
    label: DataTypes.STRING,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Tasks',
    createdAt: false,
    updatedAt: false,
  });
  return Tasks;
};