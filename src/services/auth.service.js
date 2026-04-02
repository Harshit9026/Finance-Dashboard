const prisma = require('../prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function register({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const error = new Error('Email already in use')
    error.status = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role || 'VIEWER' }
  })

  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const error = new Error('Invalid email or password')
    error.status = 401
    throw error
  }

  if (user.status === 'INACTIVE') {
    const error = new Error('Account is inactive')
    error.status = 403
    throw error
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    const error = new Error('Invalid email or password')
    error.status = 401
    throw error
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return { token, role: user.role, name: user.name }
}

module.exports = { register, login }