'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfitRecommended extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ProfitRecommended.init({
    userid: DataTypes.INTEGER,
    lv1: DataTypes.INTEGER,
    lv2: DataTypes.INTEGER,
    lv3: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProfitRecommended',
  });
  return ProfitRecommended;
};