"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    data.map((item) => {
      item.created_at = new Date();
      item.updated_at = new Date();
    });
    await queryInterface.bulkInsert("Members", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Members", null, {});
  },
};

const data = [
  {
    fname: "Anirut",
    lname: "Wongsorn",
    username: "anwongso",
    avatar: "",
    password: "12345",
    email: "anirutwongsorn@gmail.com",
    phone: "0647920863",
    status: 1,
    userref: "admin",
  },
  {
    fname: "Sarayut",
    lname: "Wongsorn",
    username: "sawongso",
    avatar: "",
    password: "123458",
    email: "sarayutwongsorn@gmail.com",
    phone: "0647920863",
    status: 1,
    userref: "user",
  },
];
