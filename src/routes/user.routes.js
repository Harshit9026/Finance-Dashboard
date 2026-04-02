const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.get('/', authenticate, requireRole('ADMIN'), userController.getAll)
router.patch('/:id/role', authenticate, requireRole('ADMIN'), userController.updateRole)
router.patch('/:id/status', authenticate, requireRole('ADMIN'), userController.updateStatus)

module.exports = router