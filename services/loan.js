'use strict';

const models = require('../models')
const repayService = require('./repayment');
const logger = require('../lib/logger');

const { LOAN_STATUS, AMOUNT_MULTIPLIER } = require('../constants');


/**
 * 
 * @param {*} userid User 
 * @param {*} amount Loan amount requested
 * @param {*} term Number of installments(weeks)
 */
exports.createLoan = async function createLoanForCustomer(userid, amount, term) {

    // Multiplying the amount by 10^4 and storing in the database
    // This should avoid extra memory in database for float/double values
    // Calculations will be simplified
    amount = amount * AMOUNT_MULTIPLIER;

    // Starting a database transaction.
    const transaction = await models.sequelize.transaction();

    try {
    
        await models.loan.create({
            user_id: userid,
            amount: amount,
            term: term,
            created_date: new Date().toISOString().split( "T" )[0],
            status: LOAN_STATUS.PENDING
        }, {
            transaction: transaction
        })

        const loanCreated = await models.loan.findOne({
            where: {
                user_id: userid
            },
            order: [ 
                ['id', 'DESC']
            ],
            transaction: transaction
        })

        const repayments = repayService.createRepaymentTerms(loanCreated.id, amount, term)

        await models.repayment.bulkCreate(repayments, { transaction: transaction });

        await transaction.commit();

    } catch (err) {
        await transaction.rollback();
        logger.error(err);
    }
}

/**
 * Gives all pending loans for the admin
 */
exports.getAllPendingLoans = async function getAllPendingLoans() {

    const query = `
        SELECT
            loan.id as loan_id,
            loan.user_id,
            loan.amount,
            loan.created_date,
            loan.term,
            'PENDING' as status
        FROM
            loan
        WHERE
            loan.status = ${LOAN_STATUS.PENDING}
    `
    const loans = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT
    })

    // Dividing the amount by the mutiplier(default: 100)
    for (let loan of loans) {
        loan.amount = loan.amount / AMOUNT_MULTIPLIER;
    }

    return loans;
}

/**
 * 
 * @param {*} userId id of the user to fetch the pending loan
 * @returns list of equated installments for the pending loans
 */
exports.getActiveLoan = async function getActiveLoan(userId) {
    const query = `
        SELECT
            repayment.loan_id,
            loan.user_id,
            repayment.term_number,
            repayment.term_date,
            repayment.term_amount,
            IF(repayment.status=3, 'PAID', IF(loan.status=2, 'APPROVED', 'PENDING')) as status
        FROM
            loan INNER JOIN repayment ON loan.id = repayment.loan_id
        WHERE
            loan.user_id = ?
            AND loan.status IN (${LOAN_STATUS.PENDING}, ${LOAN_STATUS.APPROVED})
        ORDER BY term_number;
    `

    const loan = await models.sequelize.query(query, {
        replacements: [ userId ],
        type: models.sequelize.QueryTypes.SELECT
    })

    // Dividing the amount by the mutiplier(default: 100)
    for (let term of loan) {
        term.term_amount = term.term_amount / AMOUNT_MULTIPLIER;
    }

    return loan;
}

/**
 * 
 * @param {*} loanId Id of loan to approve
 * This will update the loan status from pending to approved
 */
exports.approveLoan = async function approveLoan(loanId) {
    
    await models.loan.update({
        status: LOAN_STATUS.APPROVED
    }, {
        where: {
            id: loanId,
            status: LOAN_STATUS.PENDING
        }
    });
}