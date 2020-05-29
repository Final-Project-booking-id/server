'use strict';
const fs = require("fs")
let merchants = JSON.parse(fs.readFileSync("./merchant.json", "utf8"))
merchants.forEach(merchant => {
    merchant.createdAt= new Date()
    merchant.updatedAt = new Date()
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Merchants', merchants, {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Merchants', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  }
};
