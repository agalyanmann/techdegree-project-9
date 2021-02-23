'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required.'
        },
        notEmpty: {
          msg: 'Please provide a first name.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required.'
        },
        notEmpty: {
          msg: 'Please provide a last name.'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The emsil you entered already exist.'
      },
      validate: {
        notNull: {
          msg: 'An email is required.'
        },
        notEmpty: {
          msg: 'Please provide an email.'
        },
        isEmail: {
          msg: 'Please provide a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required.'
        },
        notEmpty: {
          msg: 'Please provide a password.'
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in lenght.'
        }
      }
    }
  }, { sequelize, timestamps: false });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: 'userId'
    });
  };

  return User;
};