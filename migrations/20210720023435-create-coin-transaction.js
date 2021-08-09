"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("coin_transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userid: {
        type: Sequelize.INTEGER,
      },
      billno: {
        type: Sequelize.STRING,
      },
      transtype: {
        type: Sequelize.INTEGER,
      },
      transdate: {
        type: Sequelize.DATE,
      },
      coinval: {
        type: Sequelize.INTEGER,
      },
      // moneyval: {
      //   type: Sequelize.STRING,
      // },
      // banktransf: {
      //   type: Sequelize.STRING,
      // },
      // datetransf: {
      //   type: Sequelize.STRING,
      // },
      // timetransf: {
      //   type: Sequelize.STRING,
      // },
      photoref: {
        type: Sequelize.STRING,
      },
      ischecked: {
        type: Sequelize.INTEGER,
      },
      checkedid: {
        type: Sequelize.INTEGER,
      },
      checked_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("coin_transactions");
  },
};
