"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    data.map((item) => {
      item.created_at = new Date();
      item.updated_at = new Date();
    });

    return await queryInterface.bulkInsert("Products", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Products", null, {});
  },
};

const data = [
  {
    name: "Product 1",
    image: "product_1.jpg",
    stock: 12,
    price: 12500,
  },
  {
    name: "Product 2",
    image: "product_2.jpg",
    stock: 3,
    price: 3456,
  },
  {
    name: "Product 3",
    image: "product_3.jpg",
    stock: 14,
    price: 3500,
  },
  {
    name: "Product 4",
    image: "product_4.jpg",
    stock: 2,
    price: 1450,
  },
];
