const express = require('express')

const user = require('../controllers/user.js');
const { authenticate } = require('../services/authenticate.js');

const router = express.Router()

// User signup api
router.post("/signup", user.signup);

// User login api
router.post("/login", user.login);

// User Loan request api
router.post("/loan", authenticate, user.applyLoan);

// User Pending Loan fetch api
router.get("/loan", authenticate, user.getLoanDetails);

// User Loan Payment API
router.post("/payment", authenticate, user.repayment);


module.exports = router