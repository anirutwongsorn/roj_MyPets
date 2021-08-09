'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profits extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Profits.init({
    userid: DataTypes.INTEGER,
    mm: DataTypes.INTEGER,
    yy: DataTypes.INTEGER,
    profit: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profits',
  });
  return Profits;
};