const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')
const { authenticate } = require('../middleware/auth.middleware')

router.get('/summary', authenticate, dashboardController.getSummary)
router.get('/trends', authenticate, dashboardController.getTrends)

module.exports = router