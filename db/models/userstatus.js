'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserStatus.belongsTo(models.Staff, {
        foreignKey:{
          name: "StaffId",
          allowNull: true
        },
        foreignKeyConstraint: 'fk_UserStatus_StaffId',
      })

    }
  }
  UserStatus.init({
    status: DataTypes.STRING,
    period: DataTypes.RANGE(DataTypes.DATE),
    StaffId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserStatus',
    createdAt: false,
    updatedAt: false,
  });
  return UserStatus;
};