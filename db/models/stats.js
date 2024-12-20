'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Stats.init({
    date: DataTypes.DATEONLY,
    avgKitchen: DataTypes.FLOAT,
    avgCounter: DataTypes.FLOAT,
    avgCleaning: DataTypes.FLOAT,
    staffJoining: DataTypes.INTEGER,
    staffLeaving: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stats',
    createdAt: false,
    updatedAt: false,
  });
  return Stats;
};