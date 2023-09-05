const { USER_TYPE } = require("../constants")

module.exports = (sequelize, DataTypes) => {
    /**
     * User TABLE
     *  - id
     *  - username
     *  - password
     */
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return User
}