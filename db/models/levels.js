'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Levels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Levels.belongsTo(models.Staff, {
        foreignKey: "StaffId",
      })
    }
  }
  Levels.init({
    label: DataTypes.STRING,
    category: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Levels',
    createdAt: false,
    updatedAt: false,
  });
  return Levels;
};