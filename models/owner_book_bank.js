"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class owner_book_banks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  owner_book_banks.init(
    {
      bkname: DataTypes.STRING,
      bkbranch: DataTypes.STRING,
      bkaccno: DataTypes.STRING,
      bkacctype: DataTypes.STRING,
      bkaccname: DataTypes.STRING,
      lineid: DataTypes.STRING,
      phoneno: DataTypes.STRING,
      isprimary: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "owner_book_banks",
      underscored: true,
      freezeTableName: true,
      updatedAt: false,
      createdAt: false,
    }
  );
  return owner_book_banks;
};
