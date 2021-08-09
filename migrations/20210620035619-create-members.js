"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("members", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fname: {
        type: Sequelize.STRING,
      },
      lname: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      userref: {
        type: Sequelize.STRING,
      },
      recref: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      province: {
        type: Sequelize.STRING,
      },
      bkaccno: {
        type: Sequelize.STRING,
      },
      bkaccname: {
        type: Sequelize.STRING,
      },
      bkacctype: {
        type: Sequelize.STRING,
      },
      bkname: {
        type: Sequelize.STRING,
      },
      bkbranch: {
        type: Sequelize.STRING,
      },
      role: {
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
    await queryInterface.dropTable("members");
  },
};
