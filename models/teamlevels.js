"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeamLevels extends Model {
    static associate(models) {
      // define association here
    }
  }
  TeamLevels.init(
    {
      userid: DataTypes.INTEGER,
      subid: DataTypes.INTEGER,
      memnum: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TeamLevels",
      freezeTableName: true,
      freezeTableNameAll: true,
    }
  );
  return TeamLevels;
};
