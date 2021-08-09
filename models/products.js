"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {}
  }
  Products.init(
    {
      pid: DataTypes.INTEGER,
      typeid: DataTypes.INTEGER,
      title: DataTypes.STRING,
      pdesc1: DataTypes.STRING,
      pdesc2: DataTypes.INTEGER,
      pdesc3: DataTypes.INTEGER,
      pdesc4: DataTypes.INTEGER,
      pdesc5: DataTypes.INTEGER,
      image: DataTypes.STRING,
      image2: DataTypes.STRING,
      image3: DataTypes.STRING,
      mindisp: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Products",
      underscored: true,
      underscoreAll: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Products;
};
