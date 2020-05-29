'use strict';
const fs = require("fs")
let services = JSON.parse(fs.readFileSync("./service.json", "utf-8"))
services.forEach(service=>{
  service.createdAt = new Date(),
  service.updatedAt = new Date()
})


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Services', services, {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
     return queryInterface.bulkDelete('Services', null, {});
  }
};
