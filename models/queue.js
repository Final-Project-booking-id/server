'use strict';
module.exports = (sequelize, DataTypes) => {
  class Queue extends sequelize.Sequelize.Model { }
  Queue.init({
    CustomerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Customer id is required'
        },
        notNull: {
          args: true,
          msg: 'Customer id is required'
        }
      }
    },
    ServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'service id is required'
        },
        notNull: {
          args: true,
          msg: 'service id is required'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending',
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'status is required'
        },
        notNull: {
          args: true,
          msg: 'status is required'
        }
      }
    },
    book_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.Sequelize.NOW,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'date is required'
        },
        notNull: {
          args: true,
          msg: 'date is required'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Queue'
  })
  Queue.associate = function (models) {
    Queue.belongsTo(models.Customer, { foreignKey: 'CustomerId' })
    Queue.belongsTo(models.Service, { foreignKey: 'ServiceId' })
    // associations can be defined here
  };
  return Queue;
};