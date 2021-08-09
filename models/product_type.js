"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product_types extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_types.init(
    {
      coinfee: DataTypes.INTEGER,
      reservedfee: DataTypes.INTEGER,
      priceup: DataTypes.INTEGER,
      nextday: DataTypes.INTEGER,
      maxprice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "product_types",
      underscored: true,
      freezeTableName: true,
      updatedAt: false,
      createdAt: false,
    }
  );
  return product_types;
};
