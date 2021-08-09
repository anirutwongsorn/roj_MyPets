"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("product_types", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      coinfee: {
        type: Sequelize.INTEGER,
      },
      reservedfee: {
        type: Sequelize.INTEGER,
      },
      priceup: {
        type: Sequelize.INTEGER,
      },
      nextday: {
        type: Sequelize.INTEGER,
      },
      maxprice: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("product_types");
  },
};
