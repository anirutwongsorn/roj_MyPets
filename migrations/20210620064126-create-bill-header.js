'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BillHeaders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      billcd: {
        type: Sequelize.STRING
      },
      guid: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      remark: {
        type: Sequelize.STRING
      },
      amt: {
        type: Sequelize.REAL
      },
      discnt: {
        type: Sequelize.REAL
      },
      gtotal: {
        type: Sequelize.REAL
      },
      ispaid: {
        type: Sequelize.INTEGER
      },
      imgref: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('BillHeaders');
  }
};