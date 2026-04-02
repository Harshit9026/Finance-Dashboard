const prisma = require('../prisma')

async function getAll() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  })
  return users
}

async function updateRole({ id, role }) {
  if (!['VIEWER', 'ANALYST', 'ADMIN'].includes(role)) {
    const error = new Error('role must be VIEWER, ANALYST or ADMIN')
    error.status = 400
    throw error
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, status: true }
  })

  return updated
}

async function updateStatus({ id, status }) {
  if (!['ACTIVE', 'INACTIVE'].includes(status)) {
    const error = new Error('status must be ACTIVE or INACTIVE')
    error.status = 400
    throw error
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true }
  })

  return updated
}

module.exports = { getAll, updateRole, updateStatus }