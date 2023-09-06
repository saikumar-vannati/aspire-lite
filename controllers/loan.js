'use strict';

const loanService = require('../services/loan');
const repayService = require('../services/repayment');
const userService = require('../services/user');

const { responseFormatter } = require('../lib/utilities');
const logger = require('../lib/logger');
const { AMOUNT_MULTIPLIER } = require('../constants');

// Apply Loan API
// Assuming User can have only one active loan
// If Loan exists, not allowing to create a new one
exports.create = async (req, res) => {
    try {

        let hasActiveLoan = await userService.hasActiveLoan(req.user.id);
        if (hasActiveLoan) return res.status(400).send(responseFormatter("", "Loan Exists"))

        await loanService.createLoan(req.user.id, req.body.amount, req.body.term);

        return res.status(201).send(responseFormatter("Loan created", ""))

    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

// Fetch Pending Loan Details API
// This API provides only active loan of the user
// Can be extended to view all loans,
// and filters can be added to view PAID loans
exports.get = async (req, res) => {
    try {
        let userLoan = await loanService.getActiveLoan(req.user.id);

        if (!userLoan.length) return res.status(400).send(responseFormatter("", "No Pending Loans"))

        return res.status(200).send(responseFormatter("Fetched Loan details Successfully", "", userLoan))

    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

// Pay term API
exports.repayment = async (req, res) => {
    try {
        const termDetails = await repayService.getTermAmount(req.user.id);

        if (!termDetails) return res.status(400).send(responseFormatter("", "Loan Not Approved or No Pending Loans"))

        if (termDetails.amount > req.body.amount * AMOUNT_MULTIPLIER)
            return res.status(400).send(responseFormatter("", 
                `Minimum Term amount ${termDetails.amount / AMOUNT_MULTIPLIER} should be paid`))

        await repayService.repayment(termDetails);

        return res.status(200).send(responseFormatter("Term Paid", "", ""))

    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}