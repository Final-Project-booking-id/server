'use strict';
module.exports = (sequelize, DataTypes) => {
class Customer extends sequelize.Sequelize.Model{}
Customer.init({
  police_number: {
    type:DataTypes.STRING,
    allowNull:false,
    unique: {
      args: true,
      msg: 'Police number already registered'
    }
  },
  password: {
    type:DataTypes.STRING,
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
  }
}, {
  sequelize,
  modelName: 'Customer'
})
  Customer.associate = function(models) {
    Customer.hasMany(models.Queue, { foreingKey: 'CustomerId' })
    // associations can be defined here
  };
  return Customer;
};