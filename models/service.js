'use strict';
module.exports = (sequelize, DataTypes) => {
  class Service extends sequelize.Sequelize.Model {}
  Service.init({
    MerchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'MerchantId is required'
        },
        notNull: {
          args: true,
          msg: 'MerchantId is required'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'name is required'
        },
        notNull: {
          args: true,
          msg: 'name is required'
        }
      }
    },
    estimation_time: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'estimation_time is required'
        },
        notNull: {
          args: true,
          msg: 'estimation_time is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Service'
    // options
  });
  Service.associate = function(models) {
    Service.hasMany(models.Queue, { foreignKey: 'ServiceId' })
    Service.belongsTo(models.Merchant, { foreignKey: 'MerchantId' }) //{ foreignKey: 'userId' }
    // associations can be defined here
  };
  return Service;
};