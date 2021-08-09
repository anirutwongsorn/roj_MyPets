'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BillWos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      billcd: {
        type: Sequelize.STRING
      },
      pdid: {
        type: Sequelize.INTEGER
      },
      uom: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.REAL
      },
      qty: {
        type: Sequelize.REAL
      },
      amount: {
        type: Sequelize.REAL
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BillWos');
  }
};