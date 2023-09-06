'use strict';

const models = require('../models')
const { LOAN_STATUS, AMOUNT_MULTIPLIER } = require('../constants');
const { equatedInstallments } = require('../lib/utilities');

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

    // const termDetails = await models.loan.findAll({
    //     attributes: ['term'],
    //     where: {
    //         user_id: userId,
    //         status: LOAN_STATUS.APPROVED
    //     },
    //     raw: true,
    //     include: [{
    //         attributes: ['loan_id', ['id', 'term_id'], ['term_amount', 'amount'], 'term_number'],
    //         model: models.repayment,
    //         where: {
    //             status: LOAN_STATUS.PENDING
    //         }
    //     }],
    // })

    if (termDetails.length > 0) {
        return termDetails[0];
    }

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

/**
 * 
 * @param {*} loanId Id of the current loan where repay terms needs to be calculated
 * @param {*} amount Amount given as loan, and to be repaid
 * @param {*} term no. of weeks user opted for loan
 * @returns List of weekly repayments user has to make for the given loan
 */
exports.createRepaymentTerms = function createRepaymentTerms (loanId, amount, term) {

    // Splitting the loan amount to equal installments
    // across the given terms
    const termAmounts = equatedInstallments(amount, term);

    // List of repayment entries for the given loan
    const repayments = [];

    let repaymentDate = new Date()
    for (let i = 1; i <= term; i++) {
        // Adding 7 days for the date for every new term
        repaymentDate.setDate(repaymentDate.getDate() + 7)
       
        repayments.push({
            loan_id: loanId,
            term_number: i,
            term_amount: termAmounts[i - 1],
            term_date: repaymentDate.toISOString().split( "T" )[0],
            status: LOAN_STATUS.PENDING
        })
    }

    return repayments;
}