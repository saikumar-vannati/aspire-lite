const express = require('express')

const admin = require('../controllers/admin')

const router = express.Router()

/**
 * ADMIN API's are not authenticated,
 * added authentication only for User api's
 * authentication can be added to admin API's as well
 */

// Admin can view all pending loans to approve
// endpoint eg: /admin/api/loans
router.get("/loans", admin.get)

// Admin loan approve api
// endpoint eg: /admin/api/loans/123/approve
router.put("/loans/:id/approve", admin.approve)

module.exports = router