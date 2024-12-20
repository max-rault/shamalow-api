'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shifts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shifts.belongsTo(models.Staff, {
        foreignKey:{
          name: "StaffId",
          allowNull: true
        },
        foreignKeyConstraint: 'fk_Shifts_StaffId',
      })

      Shifts.belongsTo(models.Periods, {
        foreignKey:{
          name: "PeriodId",
          allowNull: true
        },
        foreignKeyConstraint: 'fk_Shifts_PeriodId',
      })
    }
  }
  Shifts.init({
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    date: DataTypes.DATEONLY,
    status: DataTypes.STRING,
    background: DataTypes.STRING,
    weekNumber: DataTypes.INTEGER,
    StaffId: DataTypes.INTEGER,
    PeriodId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shifts',
    createdAt: false,
    updatedAt: false,
  });
  return Shifts;
};