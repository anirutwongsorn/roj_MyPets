"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class playing_time extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  playing_time.init(
    {
      inittime: DataTypes.TIME,
      endtime: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "playing_time",
      freezeTableName: true,
      underscoredall: true,
      createdAt: false,
      updatedAt: false,
    }
  );
  return playing_time;
};
