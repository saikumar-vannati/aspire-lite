'use strict';

const models = require('../models')

const { LOAN_STATUS } = require('../constants');
const { splitLoanAmount } = require('../lib/utilities');
const logger = require('../lib/logger');

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
    amount = amount * 10000;

    // Splitting the loan amount to equal installments
    const termAmounts = splitLoanAmount(amount, term);

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

        const repayments = [];
        let repaymentDate = new Date()
        for (let i = 1; i <= term; i++) {
            repaymentDate.setDate(repaymentDate.getDate() + 7)
            repayments.push({
                loan_id: loanCreated.id,
                term_number: i,
                term_amount: termAmounts[i - 1],
                term_date: repaymentDate.toISOString().split( "T" )[0],
                status: LOAN_STATUS.PENDING
            })
        }

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
exports.getAllPendingLoans = function getAllPendingLoans() {

    const query = `
        SELECT
            loan.id as loan_id,
            loan.user_id,
            loan.amount/10000 as amount,
            loan.created_date,
            loan.term,
            'PENDING' as status
        FROM
            loan
        WHERE
            loan.status = ${LOAN_STATUS.PENDING}
    `
    return models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT
    })
}

/**
 * 
 * @param {*} userId id of the user to fetch the pending loan
 * @returns list of equated installments for the pending loans
 */
exports.getUserLoan = function getUserLoan(userId) {
    const query = `
        SELECT
            repayment.loan_id,
            loan.user_id,
            repayment.term_number,
            repayment.term_date,
            repayment.term_amount/10000 as term_amount,
            IF(repayment.status=3, 'PAID', IF(loan.status=2, 'APPROVED', 'PENDING')) as status
        FROM
            loan INNER JOIN repayment ON loan.id = repayment.loan_id
        WHERE
            loan.user_id = ?
            AND loan.status IN (${LOAN_STATUS.PENDING}, ${LOAN_STATUS.APPROVED})
        ORDER BY term_number;
    `

    return models.sequelize.query(query, {
        replacements: [ userId ],
        type: models.sequelize.QueryTypes.SELECT
    })
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

/**
 * 
 * @param {*} userId 
 * @returns Current pending term details
 */
exports.getTermAmount = async function getTermAmount(userId) {
    
    // Query gives the current pending term details
    const query = `
        SELECT
            repayment.loan_id,
            repayment.id as term_id,
            repayment.term_amount as amount,
            repayment.term_number,
            loan.term
        FROM
            loan INNER JOIN repayment ON loan.id = repayment.loan_id
        WHERE
            loan.user_id = ?
            AND loan.status = ${LOAN_STATUS.APPROVED}
            AND repayment.status = ${LOAN_STATUS.PENDING}
        ORDER BY term_number
        LIMIT 1;
    `

    const termDetails = await models.sequelize.query(query, {
        replacements: [ userId ],
        type: models.sequelize.QueryTypes.SELECT
    })

    if (termDetails.length > 0)
        return termDetails[0];

    return null;
}
/**
 * 
 * @param {*} param0 
 * loan_id: Id of loan which term is being repaid
 * term_id: Id of term which is being repaid
 * term_number: Curren term number
 * term: total terms opted to repay the loan
 */
exports.repayment = async function repayment({ loan_id, term_id, term_number, term }) {

    // Updating the term Status to paid
    await models.repayment.update({
        status: LOAN_STATUS.PAID
    }, {
        where: {
            id: term_id
        },
    });

    // For last term, need to update the Loan status to PAID
    if (term_number == term)
        // Update Overall loan status if it is the last term
        await models.loan.update({
            status: LOAN_STATUS.PAID
        }, {
            where: {
                id: loan_id
            }
        });
}