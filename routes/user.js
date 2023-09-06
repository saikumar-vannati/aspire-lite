const express = require('express')

const user = require('../controllers/user');
const loan = require("../controllers/loan")
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router()

// User signup api
// endpoint: /api/signup

router.post("/signup", user.signup);

// User login api
// endpoint: /api/login

router.post("/login", user.login);

// All user api's are authenticated
// User Loan request api
// endpoint: /api/loans

router.post("/loans", authenticate, loan.create);

// User Pending Loan fetch api
// endpoint: /api/loans

router.get("/loans", authenticate, loan.get);

// User Loan Payment API
// endpoint: /api/loans/payment

router.post("/loans/payment", authenticate, loan.repayment);


module.exports = router