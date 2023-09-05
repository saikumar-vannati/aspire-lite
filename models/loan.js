const { LOAN_STATUS } = require("../constants")

module.exports = (sequelize, DataTypes) => {
    /**
     * Loans TABLE - Stores the information of the loan and term
     *  - id
     *  - user_id: foreign key reference of user table
     *  - amount
     *  - term
     *  - status
     *  - created_date
     */
    const Loan = sequelize.define('loan', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            default: 0
        },
        term: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 1
        },
        status: {
            type: DataTypes.TINYINT(4),
            allowNull: false,
            default: LOAN_STATUS.PENDING
        },
        created_date: {
            type: DataTypes.DATEONLY
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Loan
}