const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { registerSchema, loginSchema, validate } = require('../validators')

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)

module.exports = router