"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pid: {
        type: Sequelize.INTEGER,
      },
      typeid: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      pdesc1: {
        type: Sequelize.STRING,
      },
      pdesc2: {
        type: Sequelize.STRING,
      },
      pdesc3: {
        type: Sequelize.STRING,
      },
      pdesc4: {
        type: Sequelize.STRING,
      },
      pdesc5: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      image2: {
        type: Sequelize.STRING,
      },
      image3: {
        type: Sequelize.STRING,
      },
      mindisp: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Products");
  },
};
