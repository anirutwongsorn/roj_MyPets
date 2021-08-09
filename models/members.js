"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class members extends Model {
    static associate(models) {}
  }
  members.init(
    {
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      status: DataTypes.INTEGER,
      userref: DataTypes.STRING,
      recref: DataTypes.STRING,
      district: DataTypes.STRING,
      province: DataTypes.STRING,
      bkaccno: DataTypes.STRING,
      bkaccname: DataTypes.STRING,
      bkacctype: DataTypes.STRING,
      bkname: DataTypes.STRING,
      bkbranch: DataTypes.STRING,
      role: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "members",
      underscored: true,
      underscoreAll: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return members;
};
