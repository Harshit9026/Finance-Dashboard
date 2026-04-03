const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transaction.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { transactionSchema, updateTransactionSchema, validate } = require('../validators')

router.get('/', authenticate, transactionController.getAll)
router.post('/', authenticate, requireRole('ANALYST', 'ADMIN'), validate(transactionSchema), transactionController.create)
router.put('/:id', authenticate, requireRole('ANALYST', 'ADMIN'), validate(updateTransactionSchema), transactionController.update)
router.delete('/:id', authenticate, requireRole('ADMIN'), transactionController.remove)

module.exports = router