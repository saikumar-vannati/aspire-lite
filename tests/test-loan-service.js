require('dotenv').config()
const t = require('tap')
const assert = require('assert');
const loanService = require('../services/loan')
const userService = require('../services/user');

const generateRandomString = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
};

t.test("Testing Loan service", async (t) => {

    // Generating random username and password for testing loan apis
    let username = generateRandomString();
    let password = generateRandomString();

    // Creating the random user and fetching the created user id
    await userService.createUser(username, password);
    const userDetails = await userService.getUserDetails({ username })
    let userId = userDetails.id;

    await t.test("Test Create Loan", async (t) => {

        let amount = 10, term = 3
        await loanService.createLoan(userId, amount, term);
    });

    // Required loan Id for admin to approve
    let latestLoanId = 0;

    // Loan is created for the random user, testing get all pending loans for admin to approve
    await t.test("Testing get all pending loans for Admin", async (t) => {

        const allLoans = await loanService.getAllPendingLoans();
        assert.ok(allLoans, "Should return an array of pending loans");
        assert.ok(allLoans.length > 0, "Length of pending loans array should be greater than 0");
        const latestLoan = allLoans[allLoans.length - 1];
        latestLoanId = latestLoan.loan_id
        assert.equal(latestLoan.status, "PENDING", "Loan status must be in pending state")
    });

    await t.test("Testing Approve Loan API", async (t) => {

        // Loan is approve, now user should be able to repay the term wise equated amount
        await loanService.approveLoan(latestLoanId);
    })

    // getUserLoan
    // User should be able to fetch the pending loans
    // Admin already approved the loan, the loan status must be in approved state
    await t.test("Testing get all pending loans for Admin", async (t) => {

        const loan = await loanService.getUserLoan(userId);
        assert.ok(loan, "Should return an array of pending terms");
        assert.ok(loan.length == 3, "Payment terms should be 3 since user opted for 3 terms");
        assert.equal(loan[0].term_amount, '3.3333', "First term amount should be 3.3333")
        assert.equal(loan[2].term_amount, '3.3334', "Last/Third term amount should be 3.3334")
    });


    await t.test("Testing get current pending term and payment", async (t) => {

        let term = await loanService.getTermAmount(userId);

        assert.ok(term, "Should return first term details");
        assert.equal(term.term_number, 1, "Should be first term since no payment is done yet")
        assert.equal(term.amount, 33333, "First term amount should be 3.3333") // Storing amount in database by multiplying it by 10^4

        // Paying for first term
        await loanService.repayment(term)

        term = await loanService.getTermAmount(userId);
        assert.ok(term, "Should return second term details");
        assert.equal(term.term_number, 2, "Should be second term since first payment is already done")
        assert.equal(term.amount, 33333, "second term amount should be 3.3333")

        // Paying for second term
        await loanService.repayment(term)

        term = await loanService.getTermAmount(userId);
        assert.ok(term, "Should return third/last term details");
        assert.equal(term.term_number, 3, "Should be third/last term since first payment is already done")
        assert.equal(term.amount, 33334, "third/laste term amount should be 3.3334")

        // Paying for third/last term
        await loanService.repayment(term)

        term = await loanService.getTermAmount(userId);
        assert.equal(term, null, "Shouldn't be any pending term as loan is fully paid")
    });
})