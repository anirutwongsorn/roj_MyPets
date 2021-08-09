"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class coin_transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  coin_transactions.init(
    {
      userid: DataTypes.INTEGER,
      billno: DataTypes.STRING,
      transtype: DataTypes.INTEGER,
      transdate: DataTypes.DATE,
      coinval: DataTypes.INTEGER,
      // moneyval: DataTypes.STRING,
      // banktransf: DataTypes.STRING,
      // datetransf: DataTypes.STRING,
      // timetransf: DataTypes.STRING,
      photoref: DataTypes.STRING,
      ischecked: DataTypes.INTEGER,
      checkedid: DataTypes.INTEGER,
      checked_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "coin_transactions",
      underscored: true,
      underscoreAll: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return coin_transactions;
};
