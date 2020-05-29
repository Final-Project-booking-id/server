'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MerchantId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Merchants",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      estimation_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Services');
  }
};