'use strict';

const userService = require('../services/user');
const loanService = require('../services/loan');

const { createToken, responseFormatter } = require('../lib/utilities');
const logger = require('../lib/logger')

// User signup API
exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await userService.getUserDetails({ username });

        if (user) return res.status(400).send(responseFormatter("", "User exists")); 

        await userService.createUser(username, password)

        return res.status(201).send(responseFormatter("User created", ""))
        
    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

// User Login API
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userService.getUserDetails({ username, password });

        if (!user) return res.status(401).send(responseFormatter("", "Bad Credentials"));

        // If user is valid, create a token and share it with user.
        const token = await createToken({
            id: user.id,
            username: user.username
        });
        
        return res.status(200).send(responseFormatter("User Logged in", "", { token }))

    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

// Apply Loan API
exports.applyLoan = async (req, res) => {
    try {

        const userLoan = await loanService.getUserLoan(req.user.id);
        if (userLoan.length > 0) return res.status(400).send(responseFormatter("", "Loan Exists"))

        await loanService.createLoan(req.user.id, req.body.amount, req.body.term);

        return res.status(201).send(responseFormatter("Loan created", ""))

    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

// Fetch Pending Loan Details API
exports.getLoanDetails = async (req, res) => {
    try {
        const userLoan = await loanService.getUserLoan(req.user.id);

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
        const termDetails = await loanService.getTermAmount(req.user.id);

        if (!termDetails) return res.status(400).send(responseFormatter("", "Loan Not Approved"))

        if (termDetails.amount > req.body.amount * 10000)
            return res.status(400).send(responseFormatter("", `Minimum Term amount ${termDetails.amount / 10000} should be paid`))

        await loanService.repayment(termDetails);

        return res.status(200).send(responseFormatter("Term Paid", "", ""))

    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}