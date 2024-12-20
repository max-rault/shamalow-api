'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Staff.hasMany(models.Shifts)
      Staff.hasMany(models.Tasks)
      Staff.hasMany(models.Levels)
      Staff.hasMany(models.Request)
      Staff.hasOne(models.UserStatus)
    }
  }
  Staff.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    mail: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    category: DataTypes.STRING,
    subCategory: DataTypes.STRING,
    contractType: DataTypes.INTEGER,
    usagePrivileges: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Staff',
    createdAt: false,
    updatedAt: false,
  });
  return Staff;
};