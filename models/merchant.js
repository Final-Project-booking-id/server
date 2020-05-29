'use strict';
module.exports = (sequelize, DataTypes) => {
  class Merchant extends sequelize.Sequelize.Model {}
  Merchant.init ({
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "please input your email address"
        },
        notEmpty: {
          args: true,
          msg: 'Email is required'
        },
        notNull: {
          args: true,
          msg: 'Email is required'
        }
      },
      unique: {
        args: true,
        msg: 'email already in use'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: "min. password 6 character"
        },
        notEmpty: {
          args: true,
          msg: 'password is required'
        },
        notNull: {
          args: true,
          msg: 'password is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'address is required'
        },
        notNull: {
          args: true,
          msg: 'address is required'
        }
      }
    },
    open_time: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'open_time is required'
        },
        notNull: {
          args: true,
          msg: 'open_time is required'
        }
      }
    },
    close_time: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'close_time is required'
        },
        notNull: {
          args: true,
          msg: 'close_time is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Merchant'
  })
  Merchant.associate = function(models) {
    Merchant.hasMany(models.Service, { foreignKey: 'MerchantId' })
    // associations can be defined here
  };
  return Merchant;
};