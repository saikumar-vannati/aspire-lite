'use strict';

const loanService = require('../services/loan');

const { responseFormatter } = require('../lib/utilities');
const logger = require('../lib/logger')

// As of now, this API provides only
// pending loans for admin to approve.
// Can be extended to view all the loans
// and filters can be added as well
exports.get = async (req, res) => {
    try {
        
        const loans = await loanService.getAllPendingLoans();
        
        return res.status(200).send(responseFormatter("Fetched Loans", "", loans))
        
    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

// Approve the pending loans
exports.approve = async (req, res) => {
    try {
        
        await loanService.approveLoan(req.body.loan_id);
        
        return res.status(201).send(responseFormatter("Approved", ""))
    } catch (err) {
        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}