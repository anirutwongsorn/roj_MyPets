"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("owner_book_banks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bkname: {
        type: Sequelize.STRING,
      },
      bkbranch: {
        type: Sequelize.STRING,
      },
      bkaccno: {
        type: Sequelize.STRING,
      },
      bkacctype: {
        type: Sequelize.STRING,
      },
      bkaccname: {
        type: Sequelize.STRING,
      },
      lineid: {
        type: Sequelize.STRING,
      },
      phoneno: {
        type: Sequelize.STRING,
      },
      isprimary: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("owner_book_banks");
  },
};
