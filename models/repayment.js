const { LOAN_STATUS } = require("../constants")

module.exports = (sequelize, DataTypes) => {
    /**
     * repayment TABLE - Stores the equated installments for each term
     *  - id
     *  - loan_id: foreign key reference to loan table
     *  - term_number: number given for each term
     *  - term_amount: installment to be paid
     *  - status
     *  - term_date: repayment date
     */
    const Repayment = sequelize.define('repayment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        loan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'loan',
                key: 'id'
            }
        },
        term_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        term_amount: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            default: 0
        },
        term_date: {
            type: DataTypes.DATEONLY
        },
        status: {
            type: DataTypes.TINYINT(4),
            allowNull: false,
            default: LOAN_STATUS.PENDING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Repayment
}