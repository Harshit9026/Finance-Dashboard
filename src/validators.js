const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('invalid email format'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional()
})

const loginSchema = z.object({
  email: z.string().email('invalid email format'),
  password: z.string().min(1, 'password is required')
})

const transactionSchema = z.object({
  amount: z.number().positive('amount must be a positive number'),
  type: z.enum(['INCOME', 'EXPENSE'], { errorMap: () => ({ message: 'type must be INCOME or EXPENSE' }) }),
  category: z.string().min(1, 'category is required'),
  date: z.string().min(1, 'date is required'),
  notes: z.string().optional()
})

const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().min(1).optional(),
  date: z.string().optional(),
  notes: z.string().optional()
})

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const details = result.error.issues.map(e => ({
        field: e.path.join('.') || 'unknown',
        message: e.message
      }))
      return res.status(400).json({
        error: 'Validation failed',
        details
      })
    }
    req.body = result.data
    next()
  }
}

module.exports = { registerSchema, loginSchema, transactionSchema, updateTransactionSchema, validate }