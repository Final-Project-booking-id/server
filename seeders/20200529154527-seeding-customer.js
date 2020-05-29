'use strict';
const fs = require("fs")
let customers = JSON.parse(fs.readFileSync("./customer.json", "utf-8"))
customers.forEach(customer=>{
  customer.createdAt = new Date(),
  customer.updatedAt = new Date()
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Customers', customers, {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Customers', null, {});
    /*a
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  }
};
