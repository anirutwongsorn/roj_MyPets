'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coin_fees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  coin_fees.init({
    fee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'coin_fees',
    underscored: true,
    freezeTableName: true
  });
  return coin_fees;
};