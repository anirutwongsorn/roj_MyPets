"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product_mains extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_mains.init(
    {
      billno: DataTypes.STRING,
      pid: DataTypes.INTEGER,
      typeid: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      nextprice: DataTypes.INTEGER,
      ownerid: DataTypes.INTEGER,
      buyerid: DataTypes.INTEGER,
      fee: DataTypes.INTEGER,
      reservedfee: DataTypes.INTEGER,
      datesale: DataTypes.DATE,
      nextdate: DataTypes.DATE,
      photoref: DataTypes.STRING,
      ischecked: DataTypes.INTEGER,
      iscancel: DataTypes.INTEGER,
      billref: DataTypes.STRING,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "product_mains",
      underscored: true,
      createdAt: false,
    }
  );
  return product_mains;
};
