const {Model, Datatypes} = require('sequelize');
const sequelize = require('../config/connection');

//define our user model
class User extends Model{}

//define table columns and configuration
User.init(
    {
        //TABLE COLUMN DEFINITIONS GO HERE
        id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Datatypes.STRING,
            allowNull: false
        },
        email: {
            type: Datatypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        } 
    },
    {
        //TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;