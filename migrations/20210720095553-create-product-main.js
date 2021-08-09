"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("product_mains", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      billno: {
        type: Sequelize.STRING,
      },
      pid: {
        type: Sequelize.INTEGER,
      },
      typeid: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      nextprice: {
        type: Sequelize.INTEGER,
      },
      ownerid: {
        type: Sequelize.INTEGER,
      },
      buyerid: {
        type: Sequelize.INTEGER,
      },
      fee: {
        type: Sequelize.INTEGER,
      },
      reservedfee: {
        type: Sequelize.INTEGER,
      },
      datesale: {
        type: Sequelize.DATE,
      },
      nextdate: {
        type: Sequelize.DATE,
      },
      photoref: {
        type: Sequelize.STRING,
      },
      ischecked: {
        type: Sequelize.INTEGER,
      },
      iscancel: {
        type: Sequelize.INTEGER,
      },
      billref: {
        type: Sequelize.STRING,
      },
      // created_at: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
      // updated_at: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("product_mains");
  },
};
