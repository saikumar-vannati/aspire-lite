'use strict';

const loanService = require('../services/loan');

const { responseFormatter } = require('../lib/utilities');
const logger = require('../lib/logger')

// User signup API
exports.getAllPendingLoans = async (req, res) => {
    try {
        
        const loans = await loanService.getAllPendingLoans();
        
        return res.status(200).send(responseFormatter("Fetched Loans", "", loans))
        
    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

exports.approveLoan = async (req, res) => {
    try {
        
        await loanService.approveLoan(req.body.loan_id);
        
        return res.status(201).send(responseFormatter("Loan approved", ""))
    } catch (err) {
        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}