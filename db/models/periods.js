'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Periods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Periods.hasMany(models.Tasks)
      Periods.hasMany(models.Shifts)
    }
  }
  Periods.init({
    name: DataTypes.STRING,
    start: DataTypes.INTEGER,
    end: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    minKitchen: DataTypes.INTEGER,
    minWaiter: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Periods',
    createdAt: false,
    updatedAt: false,
  });
  return Periods;
};