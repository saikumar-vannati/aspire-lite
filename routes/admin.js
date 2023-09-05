const express = require('express')

const admin = require('../controllers/admin')

const router = express.Router()

// Admin can view all pending loans to approve
router.get("/loans", admin.getAllPendingLoans)

// Admin loan approve api
router.put("/approve", admin.approveLoan)

module.exports = router