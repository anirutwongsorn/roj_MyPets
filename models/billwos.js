'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BillWos extends Model {
    static associate(models) {
    }
  };
  BillWos.init({
    billcd: DataTypes.STRING,
    pdid: DataTypes.INTEGER,
    uom: DataTypes.STRING,
    price: DataTypes.REAL,
    qty: DataTypes.REAL,
    amount: DataTypes.REAL
  }, {
    sequelize,
    modelName: 'BillWos',
    underscored: true,
    underscoreAll: true,
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return BillWos;
};