'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Request.belongsTo(models.Staff, {
        foreignKey:{
          name: "StaffId",
          allowNull: true
        },
        foreignKeyConstraint: 'fk_Requets_StaffId',
      })
    }
  }
  Request.init({
    creationDate: DataTypes.DATE,
    contents: DataTypes.TEXT,
    title: DataTypes.STRING,
    startPeriod: DataTypes.DATEONLY,
    endPeriod: DataTypes.DATEONLY,
    status: DataTypes.STRING,
    StaffId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Request',
    createdAt: false,
    updatedAt: false,
  });
  return Request;
};