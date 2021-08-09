"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class homesliders extends Model {
    static associate(models) {
      // define association here
    }
  }
  homesliders.init(
    {
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "homesliders",
      underscored: true,
      underscoreAll: true,
      freezeTableName: true,
    }
  );
  return homesliders;
};
