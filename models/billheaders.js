'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BillHeaders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BillHeaders.init({
    billcd: DataTypes.STRING,
    guid: DataTypes.STRING,
    username: DataTypes.STRING,
    remark: DataTypes.STRING,
    amt: DataTypes.REAL,
    discnt: DataTypes.REAL,
    gtotal: DataTypes.REAL,
    ispaid: DataTypes.INTEGER,
    imgref: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BillHeaders',
    underscored: true,
    underscoreAll: true,
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return BillHeaders;
};