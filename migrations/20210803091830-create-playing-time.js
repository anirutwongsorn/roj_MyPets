"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("playing_time", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inittime: {
        type: Sequelize.TIME,
      },
      endtime: {
        type: Sequelize.TIME,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("playing_time");
  },
};
